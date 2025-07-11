# 🌟 BUCKETLIST – Ett drömprojekt i TypeScript

> ✨ “Alla stora äventyr börjar med en dröm. Nu är det dags att koda din egen!” ✨

---

## 🧭 Om projektet

Du har fått en färdig HTML-struktur – din uppgift är att ge liv åt den med **TypeScript** och **DOM-manipulation**.

Appen är en **Bucket List** – alltså en "att göra innan jag dör"-lista. Till skillnad från en vanlig to-do, handlar det här om dina **drömmar**: små som stora.

Figmaskissen: [länk](https://www.figma.com/design/wlk1szMZUIRXUduhvb6qI5/Untitled?node-id=0-1&t=jEHFpiZDKjmukotw-1)

---

## 🔐 Steg 1: Logga in

Det första användaren gör är att logga in med ett namn. Vi använder **ingen backend eller inloggning på riktigt**, utan:

- ✅ Användaren skriver in sitt namn  
- ✅ Det namnet sparas i en **global variabel** (`name`) som resten av appen kan använda  
- ✅ Lösenordet finns bara som ett formulärfält och ska **kunna visas/döljas** med ett klick

### 🧪 Validering

- Namn får inte vara tomt  
- Lösenord måste innehålla minst 4 tecken (t.ex.)

---

## 🏠 Steg 2: Dashboard – hantera drömmar

I `Dashboard`-vyn kommer listan över användarens drömmar.

### 🎯 Vad du ska göra:

- 🔁 **Rendera drömlistan dynamiskt från `dreams`-arrayen**  
  (HTML:n ska se likadan ut som nu – men skapas i TypeScript!)
- ➕ **Lägga till nya drömmar** via ett formulär (med namn och tema), visa gärna en konfirmering att drömmen har lagts till
- 🗑️ **Ta bort drömmar**
- ✅ **Kunna markera en dröm som uppfylld / inte uppfylld** (via checkbox)

📌 Tips: Varje dröm har `id`, `name`, `theme`, `checked`. Du hittar dem i `variables.ts`.

---

### 🧪 Valideringsexempel

- Nya drömmar måste ha ett namn
- Pricka av att ett tema är valt

---

## 🌈 Bonus: Level Ups (om du har tid!)

Vill du gå längre? Satsa på dessa extrauppgifter:

### ⚙️ Inställningar (`Settings`-vyn):

- ✏️ **Ändra namn** – så det uppdateras globalt
- 🎨 **Lägg till nya teman** (läggs till i `themes`-arrayen och blir valbara)
- ❌ **Ta bort teman** – och om någon dröm hade det temat: rensa det så det står “–” eller liknande
