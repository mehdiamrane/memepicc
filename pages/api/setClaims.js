// import { auth } from "services/api/initFirebase";

// const setClaims = async (req, res) => {
//   const { uid, customClaims } = req.body;

//   auth
//     .setCustomUserClaims(uid, customClaims)
//     .then(() => {
//       return res.status(200).json({
//         message: "Updated user custom claims",
//       });
//     })
//     .catch((error) => {
//       return res.status(500).send(error.message);
//     });
// };

// export default setClaims;

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };
