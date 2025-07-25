# Bucket List

## Overview

This project is a frontend Typescript exercise focused on DOM manipulation, interactive UI development and project structure. Based on a pre-designed HTML & CSS template, **Bucket List** allows users to create and organise their personal goals and dreams.

<table>
    <tr>
        <td width="25%" valign="top">
            <i>Login:</i><br>
            <img src="assets/screenshots/login.png" width="100%">
        </td>
        <td width="25%" valign="top">
            <i>Dashboard:</i><br>
            <img src="assets/screenshots/dashboard.png" width="100%">
        </td>
        <td width="25%" valign="top">
            <i>Add dream:</i><br>
            <img src="assets/screenshots/addDream.png" width="100%">
        </td>
        <td width="25%" valign="top">
            <i>Settings:</i><br>
            <img src="assets/screenshots/settings.png" width="100%">
        </td>
    </tr>
</table>

## Technologies Used

- Typescript
  - event handling & DOM manipulation
  - form validation
  - dynamic rendering
- HTML5
- CSS3

## How to Run

1. Clone this repository:

```bash
git clone https://github.com/jplimmer/bucket-list.git
```

2. Install packages (typescript) and compile:

```bash
npm install
npx tsc
```

3. Open `index.html` in your browser.

## Project Structure

```
├── assets/
│   └── icons/
│       └── (icon assets)
├── pages/
│   ├── add-dream.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   └── settings.html
├── src/
│   ├── constants/
│   ├── models/
│   ├── pages/
│   ├── services/
│       ├── authService.ts
│       ├── dreamService.ts
│       └── themeService.ts
│   ├── ui/
│   ├── utils/
│   └── validation/
├── styles/
│   └── (css styles)
├── .gitignore
├── tsconfig.json
└── README.md (this file)
```
