import { create } from "zustand";

const user = JSON.parse(localStorage.getItem("user"));
const accessToken = localStorage.getItem("accessToken");
const currentReceiver = JSON.parse(localStorage.getItem("currentReceiver"));

export const useStore = create((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  accessToken,
  user,
  friends: null,
  typing: null,
  setTyping: (typing) => set({ typing }),
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) =>
    set(({ friends }) => {
      return { friends: [...friends, friend] };
    }),
  updateFriend: (user) =>
    set(({ friends }) => {
      const index = friends.findIndex((f) => f._id === user._id);
      friends[index] = user;
      return { friends: [...friends] };
    }),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    return set({ user });
  },
  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    return set({ accessToken });
  },
  input: "",
  setInput: (input) => set({ input }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    return set(({ messages }) => {
      return { messages: [...messages, message] };
    });
  },
  currentReceiver,
  setCurrentReceiver: (currentReceiver) => {
    localStorage.setItem("currentReceiver", JSON.stringify(currentReceiver));
    return set({ currentReceiver });
  },
}));
