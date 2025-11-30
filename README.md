# KiezzThought 🧠✨

Welcome to your digital garden. This is where your scattered thoughts, deep dives, and poetic moments live.

## 🚀 How to Add a New "Blog" Post

Since this project is all about **unique vibes for every post**, we don't use a standard database. We "hardcode" each page to give you full creative freedom.

Here is your step-by-step checklist when you have a new idea:

### Step 1: Create the File 📄
1.  Go to the folder: `src/pages/posts/`
2.  Create a new file. Name it something simple related to your idea.
    *   *Example:* `MidnightThoughts.tsx` or `CodingStruggle.tsx` (Must end in `.tsx`)
3.  Copy this **Starter Template** into that new file:

```tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import HoverDef from '../../components/HoverDef'; // Uncomment if you want the hover definitions!

export default function MyNewPost() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff', // 🎨 CHANGE THIS: Background color
      color: '#000000',      // 🎨 CHANGE THIS: Text color
      fontFamily: 'sans-serif', // 🎨 CHANGE THIS: Font
      padding: '2rem'
    }}>
      {/* Navigation Back Home */}
      <nav style={{ marginBottom: '3rem' }}>
        <Link to="/">&larr; Back Home</Link>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Your Title Here</h1>
        <p>
          Write your content here...
        </p>
      </main>
    </div>
  );
}
```

### Step 2: Register the Route 🗺️
For the internet to "find" your new page, you need to give it a URL address.

1.  Open `src/App.tsx`
2.  Import your new page at the top:
    ```tsx
    import MidnightThoughts from './pages/posts/MidnightThoughts';
    ```
3.  Add a `<Route />` inside the `<Routes>` block:
    ```tsx
    <Route path="/post/midnight" element={<MidnightThoughts />} />
    ```
    *(Note: `/post/midnight` is the link that will appear in the browser bar)*

### Step 3: Add a Card to the Home Page 🏠
Now you need a way for people to actually click on it from the main menu.

**IMPORTANT RULE:** Every card MUST include the **Date and Time** when you wrote the thought. This anchors your thoughts in time.

1.  Open `src/pages/Home.tsx`
2.  Find the `<div style={{ display: 'grid'...` section.
3.  Add a new `<Link>` block for your post. You can style this card however you want!

```tsx
{/* My New Post Card */}
<Link to="/post/midnight">
  <motion.div
    whileHover={{ scale: 1.05 }}
    style={{
      height: '300px',
      background: '#e0e0e0', 
      padding: '2rem',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between' // Keeps date at top/bottom
    }}
  >
    {/* HEADER: Category + Date (Compulsory!) */}
    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7, fontSize: '0.8rem' }}>
      <span>THOUGHTS</span>
      <span>Dec 12 • 11:42 PM</span>
    </div>

    <h2>The Midnight Thought</h2>
    
    {/* FOOTER: Cool Extras (Optional) */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>🌙 2 min read</span>
      <span>Read &rarr;</span>
    </div>
  </motion.div>
</Link>
```

### 💡 Ideas for "Cool Stuff" on Cards
Don't just make boring boxes! Try adding these details to your cards in `Home.tsx`:

*   **Reading Time:** "3 min read" (Calculated by guessing!)
*   **Weather Icon:** Was it raining when you wrote it? Add a 🌧️.
*   **Mood Color:** Use a colored dot 🔴 to show if you were angry, happy, or sad.
*   **Tags:** `#philosophy` `#rant` `#code`
*   **Current Song:** "Listening to: Lofi Beats"

### 🎨 Creative Tools at Your Disposal

*   **Animations:** We have `framer-motion` installed.
    *   Wrap elements in `<motion.div>` or `<motion.h1>`
    *   Add props like `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}` to make them fade in.
*   **Hover Definitions:**
    *   Import it: `import HoverDef from '../../components/HoverDef';`
    *   Use it: `<HoverDef word="ComplexWord" definition="The meaning..." />`
*   **Icons:** You can use `lucide-react` for icons.
    *   `import { Heart } from 'lucide-react';`
    *   Usage: `<Heart color="red" size={24} />`

---

*Remember: There are no rules. If you want a page to be sideways, make it sideways. If you want a page to be just one giant word, do it.*
