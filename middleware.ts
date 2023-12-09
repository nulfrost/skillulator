import { rewrite } from "@vercel/edge";

export default function middleware(request: Request) {
  return rewrite(new URL("/en", request.url));
}
