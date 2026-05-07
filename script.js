/* BASE PRICES */
const basePrices = {
  exterior: { small: 100, medium: 130, large: 160 },
  interior: { small: 120, medium: 150, large: 180 },
  full:     { small: 220, medium: 260, large: 300 },
  signature:{ small: 380, medium: 420, large: 460 }
};

/* SLOGAN EASTER EGG */
let sloganClicks = 0;
function countSloganClick() {
  sloganClicks++;
  if (sloganClicks >= 10) {
    togglePurpleInfo();
    sloganClicks = 0;
  }
}

/* MAIN PRICE CALCULATOR */
function updateTotal() {
  let base = document.querySelector('input[name="base"]:checked');
  let size = document.querySelector('input[name="size"]:checked');

  let total = 0;
  let summaryParts = [];
  let breakdownHTML = "";

  /* Add-on elements */
  const tire = document.querySelector('#addon-tire').previousElementSibling.querySelector('input');
  const seat = document.querySelector('#addon-seat').previousElementSibling.querySelector('input');
  const headlight = document.querySelector('#addon-headlight').previousElementSibling.querySelector('input');
  const engine = document.querySelector('#addon-engine').previousElementSibling.querySelector('input');
  const polish = document.querySelector('#addon-polish').previousElementSibling.querySelector('input');

  const allAddons = [tire, seat, headlight, engine, polish];

  /* RESET ALL ADD-ONS */
  allAddons.forEach(cb => {
    if(cb) {
      cb.disabled = false;
      cb.classList.remove("disabled-addon");
    }
  });

  /* APPLY RULES BASED ON BASE SERVICE */
  if (base) {
    switch (base.value) {
      case "exterior":
        if (seat) {
          seat.disabled = true;
          seat.classList.add("disabled-addon");
        }
        break;

      case "interior":
        [tire, headlight, engine, polish].forEach(cb => {
          if (cb) {
            cb.disabled = true;
            cb.classList.add("disabled-addon");
          }
        });
        break;

      case "full":
        /* All add-ons enabled */
        break;

      case "signature":
        /* Disable ALL add-ons */
        allAddons.forEach(cb => {
          if(cb) {
            cb.disabled = true;
            cb.checked = false;
            cb.classList.add("disabled-addon");
          }
        });
        break;
    }
  }

  /* BASE + SIZE PRICE */
  if (base && size) {
    let b = base.value;
    let s = size.value;

    let baseCost = basePrices[b][s];
    total += baseCost;

    let baseLabel = {
      exterior: "Exterior Detail",
      interior: "Interior Detail",
      full: "Full Detail",
      signature: "Signature Package"
    }[b];

    let sizeLabel = {
      small: "Small (Sedan/Coupe)",
      medium: "Medium (SUV/Crossover)",
      large: "Large (Truck/Minivan)"
    }[s];

    summaryParts.push(`${baseLabel} — ${sizeLabel}`);
    breakdownHTML += `<strong>${baseLabel} (${sizeLabel})</strong>: $${baseCost}<br>`;
  }

  /* SIGNATURE PACKAGE OVERRIDE */
  if (base && base.value === "signature") {
    summaryParts = ["Signature Package — All services included"];
    breakdownHTML = `<strong>Signature Package</strong><br>All services + all add-ons included`;

    document.getElementById("totalPrice").innerText = "$" + total;
    document.getElementById("summaryBox").innerText = summaryParts.join(" | ");
    document.getElementById("breakdownBox").innerHTML = breakdownHTML;
    return;
  }

  /* ADD-ONS */
  const addonCheckboxes = document.querySelectorAll('.addon-item input[type="checkbox"]');
  let addonLabels = [];

  addonCheckboxes.forEach(cb => {
    if (cb.checked && !cb.disabled) {
      let addonCost = parseFloat(cb.value || 0);
      total += addonCost;

      const span = cb.parentElement.querySelector('span');
      let label = span ? span.textContent.trim() : "Add-on";

      addonLabels.push(label);
      breakdownHTML += `${label}: $${addonCost}<br>`;
    }
  });

  if (addonLabels.length > 0) {
    summaryParts.push("Add‑ons: " + addonLabels.join(", "));
  }

  /* UPDATE UI */
  document.getElementById("totalPrice").innerText = "$" + total;
  document.getElementById("summaryBox").innerText =
    summaryParts.length > 0 ? summaryParts.join(" | ") : "No selections yet.";
  document.getElementById("breakdownBox").innerHTML = breakdownHTML;
}

/* TOGGLE ADD-ON DESCRIPTION */
function toggleAddonDesc(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("visible");
}

/* BOOKING POPUP */
function openBooking() {
  const dialog = document.getElementById("bookingPopup");
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.showModal();
  }
}

/* PRICE INFO POPUP */
function togglePriceInfo() {
  const dialog = document.getElementById("priceInfoPopup");
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.showModal();
  }
}

/* EASTER EGG PANEL */
function togglePurpleInfo() {
  const panel = document.getElementById("purpleInfo");
  if(panel) {
    panel.style.bottom = panel.style.bottom === "0px" ? "-200px" : "0px";
  }
}

/* EVENT LISTENERS */
document.addEventListener("DOMContentLoaded", () => {
  
  // Base & Size radio buttons
  document.querySelectorAll('input[name="base"], input[name="size"]').forEach(el => {
    el.addEventListener('change', updateTotal);
  });

  // Add-on checkboxes
  document.querySelectorAll('.addon-item input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', updateTotal);
  });

  // Add-on spans (click to toggle description)
  document.querySelectorAll('.addon-item span').forEach(el => {
    el.addEventListener('click', (e) => {
      // Find the sibling div with class .addon-desc
      const container = e.target.closest('.addon-item');
      if (container) {
        const descEl = container.querySelector('.addon-desc');
        if (descEl) {
          toggleAddonDesc(descEl.id);
        }
      }
    });
  });

  // Info icons
  document.querySelectorAll('.info-icon').forEach(el => {
    el.addEventListener('click', togglePriceInfo);
  });

  // Book buttons
  document.querySelectorAll('.book-btn').forEach(el => {
    el.addEventListener('click', openBooking);
  });

  // Close booking popup button
  const closeBookingBtns = document.querySelectorAll('.close-booking-btn');
  closeBookingBtns.forEach(btn => btn.addEventListener('click', openBooking));

  // Close price info popup button
  const closePriceBtns = document.querySelectorAll('.close-price-btn');
  closePriceBtns.forEach(btn => btn.addEventListener('click', togglePriceInfo));

  // Slogan click
  const slogan = document.getElementById('slogan');
  if (slogan) {
    slogan.addEventListener('click', countSloganClick);
  }

  // CLOSE EASTER EGG WHEN CLICKING OUTSIDE
  document.addEventListener("click", function(e) {
    const panel = document.getElementById("purpleInfo");
    if (!panel) return;
    if (!panel.contains(e.target) && e.target !== slogan) {
      panel.style.bottom = "-200px";
    }
  });

});
