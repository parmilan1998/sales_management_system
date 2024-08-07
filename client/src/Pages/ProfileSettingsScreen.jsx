/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ChangePassword from "../Components/admin/ChangePassword";
import UpdateProfile from "../Components/admin/UpdateProfile";
import axios from "axios";
import GridLoader from "react-spinners/GridLoader";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ProfileSettingsScreen = () => {
  const token = localStorage.getItem("token");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = `${apiUrl}/public/profile`;
  console.log(baseUrl);

  const showPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const showProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCancelPassword = () => {
    setIsPasswordModalOpen(false);
  };

  const handleCancelProfile = () => {
    setIsProfileModalOpen(false);
  };

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const res = await axios.get(`${apiUrl}/api/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className="max-w-screen-xl lg:px-8 lg:py-12 h-screen font-poppins">
          <div className="overflow-hidden rounded pb-12 mx-auto bg-gray-300 text-center text-slate-500">
            <figure className="p-6 pb-0">
              <h1 className="text-3xl text-center font-medium py-8 text-cyan-600">
                Admin Profile
              </h1>
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full text-white">
                <img
                  src={`${baseUrl}/${user.profileImage}`}
                  alt="user name"
                  title="user name"
                  width="80"
                  height="80"
                  className="max-w-full rounded-full"
                />
              </span>
            </figure>
            <div className="p-6">
              <header className="mb-4">
                <h3 className="text-xl font-medium text-slate-700">
                  {user.username}
                </h3>
                <p className="text-slate-400">{user.email}</p>
              </header>
            </div>
            <div className="flex justify-center gap-2 p-6 pt-0">
              <Button
                onClick={showPasswordModal}
                className="h-10 px-5 w-40 bg-emerald-500 text-base text-white hover:bg-emerald-800"
              >
                Change Password
              </Button>
              <Modal
                title={
                  <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                    Change Password
                  </div>
                }
                style={{ textAlign: "center" }}
                open={isPasswordModalOpen}
                onCancel={handleCancelPassword}
                footer={null}
                className="lg:mr-72"
              >
                <ChangePassword setIsModalOpen={setIsPasswordModalOpen} />
              </Modal>

              <Button
                onClick={showProfileModal}
                className="h-10 px-5 w-40 bg-blue-500 text-base text-white hover:bg-emerald-800"
              >
                Update Profile
              </Button>
              <Modal
                title={
                  <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                    Update Profile
                  </div>
                }
                style={{ textAlign: "center" }}
                open={isProfileModalOpen}
                onCancel={handleCancelProfile}
                footer={null}
                className="lg:mr-72"
              >
                <UpdateProfile
                  setIsModalOpen={setIsProfileModalOpen}
                  user={user}
                  fetchDetails={fetchDetails}
                />
              </Modal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsScreen;
