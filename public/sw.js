self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Raifu", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Raifu";
  const options = {
    body: data.body || "",
    data: { url: data.url || "/dashboard" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : "/dashboard";
  event.waitUntil(clients.openWindow(url));
});
