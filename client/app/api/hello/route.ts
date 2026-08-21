import {NextResponse} from "next/server";

export async function GET(){
  console.log("Server is runing ");
  return Response.json({messagae:"Welcome to the server"});
}