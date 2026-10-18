import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Edit2, Save } from "lucide-react";
import { updateUserProfile } from "../../services/api";

const baseURL = "https://backend.gadgetglobe.com.bd/";

export default function AccountSettings({ user, setUser }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joined: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      setProfileImage(user.image || "");
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        joined: user.joined || "",
        status: user.status || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);

      if (imageFile) {
        form.append("image", imageFile);
      }

      const res = await updateUserProfile(form);

      if (res) {
        setIsEditingProfile(false);

        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          image: profileImage.startsWith("blob:")
            ? prev.image
            : profileImage,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const contactFields = [
    { label: "Full Name", icon: Edit2, type: "text", name: "name" },
    { label: "Email Address", icon: Mail, type: "email", name: "email" },
    { label: "Phone Number", icon: Phone, type: "tel", name: "phone" },
  ];

  const addressFields = [
    { label: "Shipping Address", icon: MapPin, type: "textarea", name: "address" },
  ];

  const preferencesFields = [
    { label: "Receive promotional emails", checked: true },
    { label: "Order status notifications", checked: true },
    { label: "Weekly newsletter", checked: false },
  ];

  return (
    <>
      {/* Loader */}
      {isSaving && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-[#5B3DF5] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-700">
              Saving changes...
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your profile information and account preferences.
          </p>
        </div>

        <button
          disabled={isSaving}
          onClick={async () => {
            if (isEditingProfile) {
              await handleSave();
            }
            setIsEditingProfile((prev) => !prev);
          }}
          className="bg-[#5B3DF5] hover:bg-[#4A2EE0] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isEditingProfile ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="h-32 bg-gradient-to-r from-[#5B3DF5] to-[#8C75F7]" />

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 relative z-10">
            <div className="flex flex-col items-start">
              <img
                src={
                  profileImage
                    ? profileImage.startsWith("blob:")
                      ? profileImage
                      : baseURL + profileImage
                    : "/default.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
              />

              {isEditingProfile && (
                <label className="mt-2 cursor-pointer text-xs text-[#5B3DF5] font-medium">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {formData.name || "User"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {formData.status || "Customer"}
              </p>
              <p className="text-slate-400 text-xs mt-2">
                Member since {formData.joined || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact + Address */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Contact Information
          </h3>

          <div className="space-y-6">
            {contactFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#5B3DF5]" />
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Address</h3>

          <div className="space-y-6">
            {addressFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#5B3DF5]" />
                  {field.label}
                </label>

                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10 transition-all resize-none h-32"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Account Preferences
        </h3>

        <div className="space-y-4">
          {preferencesFields.map((pref, i) => (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors w-max"
            >
              <input
                type="checkbox"
                defaultChecked={pref.checked}
                className="w-5 h-5 rounded border-slate-300 text-[#5B3DF5] focus:ring-[#5B3DF5]"
              />
              <span className="text-sm font-medium text-slate-700">
                {pref.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-red-700 mb-3">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </>
  );
}