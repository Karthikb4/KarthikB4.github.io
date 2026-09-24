
document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // 1. Feature 1: Dark Mode Toggle
    // --------------------------------------------------------------------------
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle-btn";
    toggleBtn.textContent = "🌓 Dark Mode";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "15px";
    toggleBtn.style.right = "15px";
    toggleBtn.style.padding = "8px 16px";
    toggleBtn.style.zIndex = "9999";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.borderRadius = "8px";
    toggleBtn.style.border = "1px solid #0d9488";
    toggleBtn.style.backgroundColor = "#0f172a";
    toggleBtn.style.color = "#ffffff";
    toggleBtn.style.fontFamily = "'JetBrains Mono', monospace";
    toggleBtn.style.fontSize = "13px";
    toggleBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    
    document.body.appendChild(toggleBtn);

    const darkStyle = document.createElement("style");
    darkStyle.id = "dark-mode-override";
    darkStyle.innerHTML = `
        body.dark-active {
            background-color: #0b0f19 !important;
            color: #cbd5e1 !important;
        }
        body.dark-active > table:first-of-type > tbody > tr:nth-child(2) > td {
            background: rgba(30, 41, 59, 0.95) !important;
            border-color: #334155 !important;
            color: #e2e8f0 !important;
        }
        body.dark-active > table:first-of-type > tbody > tr:nth-child(2) > td a {
            background: #0f172a !important;
            color: #f8fafc !important;
            border-color: #334155 !important;
        }
        body.dark-active > table:first-of-type > tbody > tr:nth-child(n+3) > td,
        body.dark-active table:has(#staff),
        body.dark-active table[border="0"] td {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border-color: #334155 !important;
        }
        body.dark-active b[id],
        body.dark-active td p b,
        body.dark-active li b {
            color: #38bdf8 !important;
        }
        body.dark-active li {
            color: #cbd5e1 !important;
        }
        body.dark-active table.tg,
        body.dark-active table[border="1"] {
            background-color: #1e293b !important;
            border-color: #334155 !important;
        }
        body.dark-active table.tg th,
        body.dark-active table[border="1"] th {
            background-color: #0f172a !important;
            color: #38bdf8 !important;
        }
        body.dark-active table.tg td,
        body.dark-active table[border="1"] td {
            background-color: #1e293b !important;
            color: #cbd5e1 !important;
            border-bottom: 1px solid #334155 !important;
        }
        body.dark-active table.tg tbody tr:nth-child(even) td,
        body.dark-active table[border="1"] tbody tr:nth-child(even) td,
        body.dark-active table[border="1"] tr:nth-child(even) td {
            background-color: #162032 !important;
        }
        body.dark-active table.tg tbody tr:hover td,
        body.dark-active table[border="1"] tbody tr:hover td,
        body.dark-active table[border="1"] tr:hover td {
            background-color: #334155 !important;
            color: #ffffff !important;
        }
        body.dark-active td[colspan] {
            background-color: #0f172a !important;
        }
        body.dark-active td[colspan] p b {
            color: #38bdf8 !important;
        }
        body.dark-active a[href="#home"],
        body.dark-active table.tg tbody a,
        body.dark-active table[border="1"] tbody a {
            background-color: #0f172a !important;
            color: #38bdf8 !important;
            border-color: #334155 !important;
        }
        body.dark-active #live-course-search {
            background-color: #1e293b !important;
            color: #f8fafc !important;
            border-color: #0d9488 !important;
        }
        mark.search-highlight {
            background-color: #fde047 !important;
            color: #000000 !important;
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(darkStyle);
    darkStyle.disabled = true;

    toggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-active");
        darkStyle.disabled = !isDark;
        toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌓 Dark Mode";
        toggleBtn.style.backgroundColor = isDark ? "#f8fafc" : "#0f172a";
        toggleBtn.style.color = isDark ? "#0f172a" : "#ffffff";
    });

    // --------------------------------------------------------------------------
    // 2. Feature 2: Keyword Highlighter & Counter Search
    // --------------------------------------------------------------------------
    const searchContainer = document.createElement("div");
    searchContainer.style.textAlign = "center";
    searchContainer.style.margin = "1.5rem auto";
    searchContainer.style.maxWidth = "800px";

    const searchInput = document.createElement("input");
    searchInput.id = "live-course-search";
    searchInput.type = "text";
    searchInput.placeholder = "🔍 Type to highlight (e.g. Python, SQL, Git, Assignment)...";
    searchInput.style.width = "75%";
    searchInput.style.padding = "10px 16px";
    searchInput.style.fontSize = "15px";
    searchInput.style.borderRadius = "8px";
    searchInput.style.border = "2px solid #0d9488";
    searchInput.style.outline = "none";
    searchInput.style.fontFamily = "'Space Grotesk', sans-serif";

    const countBadge = document.createElement("span");
    countBadge.style.marginLeft = "12px";
    countBadge.style.fontFamily = "'JetBrains Mono', monospace";
    countBadge.style.fontSize = "13px";
    countBadge.style.color = "#0d9488";
    countBadge.style.fontWeight = "bold";

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(countBadge);

    // Insert under the navigation bar row
    const navBarRow = document.querySelector("body > table:first-of-type > tbody > tr:nth-child(2)");
    if (navBarRow && navBarRow.parentNode) {
        navBarRow.parentNode.insertBefore(searchContainer, navBarRow.nextSibling);
    }

    // Cache original HTML content for search target cells so highlights can reset safely
    const targetCells = document.querySelectorAll(
        "table.tg tbody td, table[border='1'] tbody td, table[border='0'] td, ul li, p"
    );
    const originalContents = new Map();
    targetCells.forEach(el => originalContents.set(el, el.innerHTML));

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();

        // 1. Reset all targets back to original HTML
        targetCells.forEach(el => {
            el.innerHTML = originalContents.get(el);
        });

        if (query.length < 2) {
            countBadge.textContent = "";
            return;
        }

        // 2. Search and replace with <mark>
        let matchCount = 0;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");

        targetCells.forEach(el => {
            // Avoid modifying the search input or buttons themselves
            if (el.contains(searchInput) || el.contains(toggleBtn)) return;

            // Only modify elements containing plain text matches
            if (regex.test(el.textContent)) {
                // Count occurrences
                const matches = el.textContent.match(regex);
                if (matches) matchCount += matches.length;

                // Replace only text inside direct text nodes to preserve links & tags
                el.innerHTML = originalContents.get(el).replace(regex, '<mark class="search-highlight">$1</mark>');
            }
        });

        // 3. Update counter badge and scroll to first match
        countBadge.textContent = matchCount > 0 ? `Found ${matchCount} match${matchCount > 1 ? "es" : ""}` : "No matches";

        const firstMatch = document.querySelector("mark.search-highlight");
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});