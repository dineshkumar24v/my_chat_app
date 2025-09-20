import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Form } from "react-bootstrap";
import "./SignUp.css";
import { toast } from "react-toastify";
import { authentication, db } from "../../ConfigFirebase/ConfigFirebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios"; // ✅ You need to install axios
import { signOut } from "firebase/auth";

const SignUp = ({ onSignupSuccess }) => {
  const [signUpDetails, setsignUpDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [uploadImage, setUploadImage] = useState({ file: null, url: "" });

  const [loading, setLoading] = useState(false);

  const handleuploadImage = (e) => {
    if (e.target.files[0]) {
      setUploadImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const uploadToCloudinary = async (uid) => {
    const data = new FormData();
    data.append("file", uploadImage.file);
    data.append("upload_preset", "ReactChatAppUploads"); // 🔁 Replace this with your Cloudinary preset
    data.append("cloud_name", "dmrgvxawa"); // 🔁 Replace with your Cloudinary cloud name

    // 👇 Store in a user-specific folder
    data.append("folder", `users/${uid}/avatar`);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmrgvxawa/image/upload",
        data
      );
      return res.data.secure_url; // ✅ returns the uploaded image URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = "";

      if (uploadImage.file) {
        avatarUrl = await uploadToCloudinary(); // 🔼 Upload to Cloudinary and get URL
        toast.success("image uploaded Successfully!", { autoClose: 2000 });
      }

      const accountCreated = await createUserWithEmailAndPassword(
        authentication,
        signUpDetails.email,
        signUpDetails.password
      );
      const uid = accountCreated.user.uid;

      await setDoc(doc(db, "users", uid), {
        username: signUpDetails.name,
        email: signUpDetails.email,
        id: uid,
        timeStamp: Date.now(),
        avatar: avatarUrl, // ✅ Store Cloudinary image URL
        blocked: [],
      });

      await setDoc(doc(db, "userChats", uid), {
        chats: [],
      });

      await signOut(authentication); //  Log out the user after signup
      toast.success("Account created Successfully! Please login", { autoClose: 2000 });
      onSignupSuccess(); //  Trigger focus in Login

      // Clear form on signup
      setsignUpDetails({ name: "", email: "", password: "" });
      setUploadImage({ file: null, url: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signUpContainer">
      <div>
        <h1 className="signuph1">Create an account</h1>
        <Form onSubmit={handleSignUpSubmit}>
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label className="text">
              <img
                src={uploadImage.url || "./avatar.jpg"}
                alt="avatar preview"
              />
              upload an image
            </Form.Label>
            <Form.Control
              type="file"
              size="sm"
              style={{ display: "none" }}
              onChange={handleuploadImage}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="display name"
              onChange={(e) =>
                setsignUpDetails({ ...signUpDetails, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              onChange={(e) =>
                setsignUpDetails({ ...signUpDetails, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password here"
              onChange={(e) =>
                setsignUpDetails({ ...signUpDetails, password: e.target.value })
              }
            />
          </Form.Group>
          <button type="submit" id="signupSubmitBtn" disabled={loading}>
            {loading ? "Loading" : "Sign Up"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
