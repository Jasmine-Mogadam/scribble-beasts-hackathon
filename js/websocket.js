export const socket = new WebSocket("ws://localhost:3000");

export function waitForMessage(messageAction) {
  return new Promise((resolve, reject) => {
    socket.addEventListener("message", (event) => {
      try {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          data = event.data;
        }
        if (data.action === messageAction) {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });

    socket.addEventListener("error", (error) => {
      reject(error);
    });

    socket.addEventListener("close", () => {
      reject(new Error("WebSocket closed before receiving a message."));
    });
  });
}

export async function getAsyncMessage(action, body) {
  socket.send(
    JSON.stringify({
      action: action,
      body: body,
    })
  );
  return (await waitForMessage(action)).result;
}

export function sendAction(action, body) {
  socket.send(
    JSON.stringify({
      action: action,
      body: body,
    })
  );
}
