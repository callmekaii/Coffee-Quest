# ☕ CoffeeQuest

> A private, personalized workspace and study-spot tracker for remote workers, students, and digital nomads.

CoffeeQuest lets users discover, curate, and catalog their favorite cafes. Each user maintains an isolated collection powered by PostgreSQL Row Level Security (RLS)—tracking essential workspace criteria like Wi-Fi speeds, outlet availability, noise levels, and custom tags.

---

## ✨ Features

- **🔐 Private User Spaces:** Full authentication backed by Supabase Auth with Row Level Security (RLS), ensuring user data remains strictly private.
- **⚡ Work-Friendly Metrics:** Track cafe specs that matter: Wi-Fi download speeds (Mbps), outlet availability, noise ambience, and ratings.
- **🏷️ Interactive Filtering:** Real-time search by cafe name combined with dynamic, auto-extracted tag pills for single-click filtering.
- **📝 Full CRUD Capabilities:** Add new spots via a quick modal, edit workspace notes on the fly, and maintain an organized personal roster.
- **🎨 Modern UI/UX:** Built with Tailwind CSS and Radix/shadcn primitives with responsive desktop and mobile support.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & Components:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A free [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/coffee-quest.git](https://github.com/your-username/coffee-quest.git)
cd coffee-quest
