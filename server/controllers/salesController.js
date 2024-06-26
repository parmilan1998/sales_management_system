const { Op } = require("sequelize");
const Sales = require("../models/sales");
const Product = require("../models/products");
const Stocks = require("../models/stocks");
const SalesDetail = require("../models/salesDetails");

// POST -> localhost:5000/api/v1/sales
exports.createSales = async (req, res) => {
  try {
    const sales = req.body;

    const createdSales = await Promise.all(
      sales.map(async (sale) => {
        const { custName, customerContact, soldDate, products } = sale;

        // Create the main sales record
        const newSale = await Sales.create({
          custName: custName,
          customerContact: customerContact,
          soldDate: soldDate,
          totalRevenue: 0, // Initial total revenue
        });

        let totalRevenue = 0;

        // Process each product in the sale
        await Promise.all(
          products.map(async (productSale) => {
            const { productName, salesQuantity } = productSale;

            // Find the product in the Product table
            const product = await Product.findOne({
              where: { productName },
            });

            if (!product) {
              throw new Error(`Product '${productName}' not found`);
            }

            const { productID, unitPrice } = product;
            const revenue = unitPrice * salesQuantity;

            // Find stock entries for the product
            const stocks = await Stocks.findAll({
              where: { productID },
              order: [["purchasedDate", "ASC"]],
            });

            let remainingQuantity = salesQuantity;
            let stockDetails = [];

            // Deduct sales quantity from available stock
            for (const stock of stocks) {
              if (remainingQuantity <= 0) break;

              let usedQuantity = Math.min(
                stock.productQuantity,
                remainingQuantity
              );
              stock.productQuantity -= usedQuantity;
              remainingQuantity -= usedQuantity;

              // Save updated stock quantity
              await stock.save();

              // Track stock details for SalesDetail creation
              stockDetails.push({ stockID: stock.stockID, usedQuantity });
            }

            if (remainingQuantity > 0) {
              throw new Error(
                `Insufficient quantity available for product '${productName}'`
              );
            }

            // Create SalesDetail record
            const createdSalesDetail = await SalesDetail.create({
              salesID: newSale.salesID,
              productID: productID,
              stockID: stockDetails[0].stockID, // Assuming first stock used for simplicity
              salesQuantity: salesQuantity,
              unitPrice: unitPrice,
              revenue: revenue,
              productName: productName,
            });

            totalRevenue += revenue; // Accumulate revenue for the sale
          })
        );

        // Update total revenue for the sale
        newSale.totalRevenue = totalRevenue;
        await newSale.save();

        return newSale;
      })
    );

    res.status(201).json({
      message: "Sales added successfully",
      sales: createdSales.flat(),
    });
  } catch (error) {
    console.error("Error creating sales:", error);
    res
      .status(500)
      .json({ message: "Error carrying out sales", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/sales/list
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.findAll({
      include: [
        {
          model: SalesDetail,
          as: "details",
          attributes: ["productName", "salesQuantity"],
        },
      ],
      order: [["soldDate", "DESC"]],
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving sales", error: error.message });
  }
};

// PUT -> localhost:5000/api/v1/sales/:id
exports.updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { custName, customerContact, soldDate, products } = req.body;

    const existingSale = await Sales.findByPk(id);
    if (!existingSale) {
      return res
        .status(404)
        .json({ message: `Sales record with ID '${id}' not found` });
    }

    // Update basic sale details
    existingSale.custName = custName || existingSale.custName;
    existingSale.customerContact =
      customerContact || existingSale.customerContact;
    existingSale.soldDate = soldDate || existingSale.soldDate;

    // Remove old sales details and restore quantities
    const oldSalesDetails = await SalesDetail.findAll({
      where: { salesID: id },
    });
    for (const detail of oldSalesDetails) {
      const stock = await Stocks.findByPk(detail.stockID);
      stock.productQuantity += detail.salesQuantity;
      await stock.save();
    }
    await SalesDetail.destroy({ where: { salesID: id } });

    const saleDetails = await Promise.all(
      products.map(async (productSale) => {
        const { productName, salesQuantity } = productSale;

        // Find the product in the Product table
        const product = await Product.findOne({ where: { productName } });
        if (!product) {
          throw new Error(`Product '${productName}' not found`);
        }

        const { unitPrice } = product;
        const calculatedTotalPrice = unitPrice * salesQuantity;

        // Find stock entries for the product
        const stocks = await Stocks.findAll({
          where: { productID: product.productID },
          order: [["purchasedDate", "ASC"]],
        });

        let remainingQuantity = salesQuantity;
        let stockDetails = [];

        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;
          let usedQuantity = 0;

          if (stock.productQuantity >= remainingQuantity) {
            usedQuantity = remainingQuantity;
            stock.productQuantity -= remainingQuantity;
            remainingQuantity = 0;
          } else {
            usedQuantity = stock.productQuantity;
            remainingQuantity -= stock.productQuantity;
            stock.productQuantity = 0;
          }

          await stock.save();

          stockDetails.push({ stockID: stock.stockID, usedQuantity });
        }

        if (remainingQuantity > 0) {
          throw new Error(
            `Insufficient quantity available for product '${productName}'`
          );
        }

        // Create the sales details records
        await Promise.all(
          stockDetails.map(async (stockDetail) => {
            await SalesDetail.create({
              salesID: existingSale.salesID,
              productID: product.productID,
              stockID: stockDetail.stockID,
              productName: product.productName,
              salesQuantity: stockDetail.usedQuantity,
              unitPrice: unitPrice,
              revenue: unitPrice * stockDetail.usedQuantity,
            });
          })
        );

        return {
          salesID: existingSale.salesID,
          productID: product.productID,
          productName: product.productName,
          salesQuantity,
          unitPrice,
          revenue: calculatedTotalPrice,
        };
      })
    );

    // Calculate total revenue for the sale
    const totalRevenue = saleDetails.reduce(
      (total, detail) => total + detail.revenue,
      0
    );
    existingSale.totalRevenue = totalRevenue;
    await existingSale.save();

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      updatedSale: existingSale,
    });
  } catch (e) {
    console.error("Error updating sales:", e);
    res.status(500).json({ message: "Error updating sales", error: e.message });
  }
};

// DELETE -> localhost:5000/api/v1/sales/:id
exports.deleteSales = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sales.findByPk(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Find associated SalesDetail entries
    const salesDetails = await SalesDetail.findAll({ where: { salesID: id } });

    // Delete associated SalesDetail entries
    for (const detail of salesDetails) {
      await detail.destroy();
    }
    // Delete the main sale record
    await sale.destroy();

    res.status(200).json({
      message: `Sales deleted successfully`,
      deletedSale: sale,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// GET -> localhost:5000/api/v1/sales/query
exports.querySales = async (req, res) => {
  try {
    // Query parameters
    const { keyword, page = 1, limit = 6, sort = "ASC" } = req.query;

    // Pagination
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = {};
    if (keyword) {
      searchCondition[Op.or] = [{ custName: { [Op.like]: `%${keyword}%` } }];
    }

    // Sorting order
    const sortOrder = sort.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Querying Sales with included SalesDetail
    const { count, rows: sales } = await Sales.findAndCountAll({
      include: {
        model: SalesDetail,
        as: "details",
        attributes: ["productName", "salesQuantity"],
      },
      where: searchCondition,
      offset,
      limit: parsedLimit,
      order: [["soldDate", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      sales,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalCount: count,
      },
    });
  } catch (error) {
    console.log("Error querying sales:", error.message);
    res
      .status(500)
      .json({ message: "Error querying sales", error: error.message });
  }
};
