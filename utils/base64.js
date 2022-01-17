export const encode = (data) => {
  if (typeof window === "undefined") {
    return Buffer.from(data).toString("base64");
  }
  return window.btoa(data);
};

export const decode = (data) => {
  if (typeof window === "undefined") {
    return Buffer.from(data, "base64").toString("utf-8");
  }
  return window.atob(data);
};
