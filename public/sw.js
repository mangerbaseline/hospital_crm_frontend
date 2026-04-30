self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : { title: "New Notification", message: "Something happened!" };

  const options = {
    body: data.message,
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});
