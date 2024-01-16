import NextAuth from "next-auth";
import { options } from "../../../auth"; 

const handler = NextAuth(options);
export default handler;
