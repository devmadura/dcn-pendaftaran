import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("generate-id", "routes/generate-id.tsx"),
  route("api/mahasiswa", "routes/api.mahasiswa.ts"),
  route("api/prodi", "routes/api.prodi.ts"),
  route("api/check-member", "routes/api.check-member.ts"),
  route("api/image", "routes/api.image.ts"),
  route("api/auth/session", "routes/api.auth.session.ts"),
] satisfies RouteConfig;
