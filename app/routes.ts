import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("api/mahasiswa", "routes/api.mahasiswa.ts"),
  route("api/prodi", "routes/api.prodi.ts"),
  route("api/check-member", "routes/api.check-member.ts")
] satisfies RouteConfig;
