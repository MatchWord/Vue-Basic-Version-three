import request from "@/utils/http";

export function getList(params) {
  return request({
    url: "/table/list",
    method: "get",
    params
  });
}
