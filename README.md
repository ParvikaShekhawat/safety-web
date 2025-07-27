# 🛡️ Safety-Web

**Safety Web** is a simple yet powerful emergency companion platform that allows users to store trusted contacts and send **SOS alerts with live location** when in danger — especially useful for women's safety, late-night commutes, or any emergency.

---

## 🚀 Features

- 📍 **Live Location SOS Alert**: Sends your current GPS location to all saved trusted contacts.
- 📞 **Trusted Contacts List**: Add, view, and remove emergency contacts stored in local storage.
- ⚠️ **Triple-Tap SOS Button**: Press the SOS button 3 times to activate emergency help.
- 🌐 **Mobile-Friendly UI**: Fully responsive and easy to use across all devices.

---

## 🧠 How It Works

1. **Add Trusted Contacts**  
   User adds names, phone numbers, and locations of people they trust into the app.

2. **Location Access**  
   When SOS is triggered, the browser asks for permission to access your current GPS location.

3. **Send SOS Alert**  
   When triggered (by clicking SOS 3 times), the app captures the current location and sends a custom emergency message (via backend) to all contacts.

4. **Contacts Receive Alert**  
   Contacts receive a message like:  
   _"Emergency! Please help me. Here's my location: [Google Maps link]"_

---

## ⚙️ Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Backend**: Node.js + Twilio (for SMS service)

---


---

## 🛑 GitHub Push Safety

To ensure secrets aren’t pushed:

- Always create a `.gitignore`
- Never commit `.env` or credentials
- Use tools like [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) if you accidentally pushed secrets

---

## 📌 Future Improvements

- ✅ User authentication
- 🌍 Global language support
- 📡 Real-time alert status tracking
- 📱 PWA support for offline and installable experience

---

## 🤝 Contribution

Want to improve this? Open issues or PRs — all contributions are welcome!

---

## 🙏 Acknowledgements

- [Twilio](https://www.twilio.com/) for reliable messaging API
- [Tailwind CSS](https://tailwindcss.com/) for UI styling
- [GitHub Secret Scanning](https://docs.github.com/en/code-security) for protecting pushed secrets

---

## 📃 License

This project is open-source and available under the MIT License.



