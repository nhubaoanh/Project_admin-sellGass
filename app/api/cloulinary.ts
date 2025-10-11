export const uploadToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append("file", file); // đúng, gửi File object
  data.append("upload_preset", "upload_preset");

  const cloudName = "dbjvxfhoy";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const resData = await res.json();
  console.log("Cloudinary response:", resData);

  return resData.secure_url; // phải trả về secure_url
};
