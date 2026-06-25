const SIDEBAR_NAV = [
    { id: "dashboard", href: "dashboard.html", label: "🏠 Dashboard" },
    { id: "attendance", href: "attendance.html", label: "📊 Attendance" },
    { id: "notes", href: "notes.html", label: "📚 Notes" },
    { id: "resources", href: "resources.html", label: "📄 Resources" },
    { id: "bookmarks", href: "bookmarks.html", label: "🔖 Bookmarks" },
    { id: "search", href: "search.html", label: "🔍 Global Search" },
    { id: "profile", href: "profile.html", label: "👤 Profile" },
    { id: "logout", action: "logout", label: "🚪 Logout" }
];

const MOBILE_BREAKPOINT = 900;

function getActivePageId() {
    const page = window.location.pathname.split("/").pop() || "dashboard.html";
    const match = SIDEBAR_NAV.find(function (item) {
        return item.href === page;
    });
    return match ? match.id : "";
}

function buildNavMarkup(activeId) {
    return SIDEBAR_NAV.map(function (item) {
        if (item.action === "logout") {
            return (
                '<li data-action="logout" role="button" tabindex="0">' +
                item.label +
                "</li>"
            );
        }

        const activeClass = item.id === activeId ? ' class="active"' : "";
        return (
            "<li" +
            activeClass +
            '><a href="' +
            item.href +
            '">' +
            item.label +
            "</a></li>"
        );
    }).join("");
}

function renderAppSidebar() {
    const mount = document.getElementById("sidebar-mount");
    if (!mount) {
        return false;
    }

    const activeId = getActivePageId();
    mount.outerHTML =
        '<button class="sidebar-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="app-sidebar">' +
        '<span class="sidebar-toggle-bar" aria-hidden="true"></span>' +
        '<span class="sidebar-toggle-bar" aria-hidden="true"></span>' +
        '<span class="sidebar-toggle-bar" aria-hidden="true"></span>' +
        "</button>" +
        '<div class="sidebar-overlay" aria-hidden="true"></div>' +
        '<aside class="sidebar" id="app-sidebar">' +
        '<h2 class="logo">Academix</h2>' +
        "<ul>" +
        buildNavMarkup(activeId) +
        "</ul>" +
        "</aside>";

    return true;
}

function initSidebarToggle() {
    const body = document.body;
    const toggle = document.querySelector(".sidebar-toggle");
    const overlay = document.querySelector(".sidebar-overlay");
    const sidebar = document.getElementById("app-sidebar");

    if (!toggle || !overlay || !sidebar) {
        return;
    }

    const mq = window.matchMedia("(max-width: " + MOBILE_BREAKPOINT + "px)");

    function isMobile() {
        return mq.matches;
    }

    function setOpen(open) {
        if (!isMobile()) {
            body.classList.remove("sidebar-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
            overlay.setAttribute("aria-hidden", "true");
            body.style.overflow = "";
            return;
        }

        body.classList.toggle("sidebar-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
        overlay.setAttribute("aria-hidden", open ? "false" : "true");
        body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
        setOpen(!body.classList.contains("sidebar-open"));
    });

    overlay.addEventListener("click", function () {
        setOpen(false);
    });

    sidebar.addEventListener("click", function (event) {
        const logoutItem = event.target.closest('[data-action="logout"]');
        if (logoutItem) {
            if (typeof logout === "function") {
                logout();
            }
            return;
        }

        if (!isMobile()) {
            return;
        }

        if (event.target.closest("a")) {
            setOpen(false);
        }
    });

    sidebar.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const logoutItem = event.target.closest('[data-action="logout"]');
        if (!logoutItem) {
            return;
        }

        event.preventDefault();
        if (typeof logout === "function") {
            logout();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && body.classList.contains("sidebar-open")) {
            setOpen(false);
            toggle.focus();
        }
    });

    mq.addEventListener("change", function () {
        setOpen(false);
    });

    window.addEventListener("resize", function () {
        if (!isMobile() && body.classList.contains("sidebar-open")) {
            setOpen(false);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderAppSidebar();
    initSidebarToggle();
});
