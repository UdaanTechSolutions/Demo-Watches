import { gsap } from 'gsap';

// ─────────────────────────────────────────────────────────────────────
// CONFIG — Change these to your real values!
// ─────────────────────────────────────────────────────────────────────

// Your WhatsApp number with country code (no + or spaces)
// e.g. India number +91 98765 43210 → '919876543210'
const WHATSAPP_NUMBER = '918000129483';

// Formspree Form ID — Sign up free at formspree.io
// Create a new form → copy the form ID (e.g. 'xeqwerty')
const FORMSPREE_ID = 'xaqpbylz';

// Fallback email (used if Formspree is not set up yet)
const FALLBACK_EMAIL = 'udaantechsolutions@proton.me';

// ─────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────
const products = [
    {
        id: 1, cardId: 'pc-1',
        name: 'Silk Evening Drape',
        price: 42000, priceStr: '₹42,000',
        colors: ['Ivory', 'Champagne Gold', 'Midnight Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'New',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
        description: 'A fluid masterpiece in 100% mulberry silk. The Evening Drape cascades effortlessly with each movement — its hand-rolled hem and bias-cut construction creating a silhouette that is both sculptural and sensuous. Lined in pure silk charmeuse. Perfect for occasions that demand quiet opulence.',
    },
    {
        id: 2, cardId: 'pc-2',
        name: 'Structured Linen Coat',
        price: 68000, priceStr: '₹68,000',
        colors: ['Natural Linen', 'Charcoal'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        tag: null,
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700&auto=format&fit=crop&q=80',
        description: 'Architectural in spirit, the Structured Linen Coat is cut from our proprietary heavy-weight linen — a fabric that holds its form through every season. The sharp lapels and box silhouette speak of intention; the unlined interior whispers of ease. Handcrafted at our Delhi atelier.',
    },
    {
        id: 3, cardId: 'pc-3',
        name: 'The Obsidian Turtleneck',
        price: 22000, priceStr: '₹22,000',
        colors: ['Obsidian', 'Ivory', 'Ash Grey', 'Deep Navy', 'Bordeaux'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: 'Bestseller',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&auto=format&fit=crop&q=80',
        description: 'Our most beloved piece, year after year. Crafted from our signature 2-ply merino wool, the Obsidian Turtleneck drapes close without constricting — a second skin of supreme refinement. The double-folded collar frames the face with quiet authority. Machine washable at 30°.',
    },
    {
        id: 4, cardId: 'pc-4',
        name: 'Wide-Leg Wool Trousers',
        price: 38000, priceStr: '₹38,000',
        colors: ['Ivory', 'Camel', 'Charcoal', 'Chocolate'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        tag: null,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&auto=format&fit=crop&q=80',
        description: 'The Wide-Leg Wool Trousers cut a commanding silhouette. Woven from 100% virgin wool, the fabric carries a subtle sheen that catches light while moving. A high-rise waist, clean front pleat, and generous leg opening make this a piece built to be worn for decades.',
    },
    {
        id: 5, cardId: 'pc-5',
        name: 'Cashmere Cloud Wrap',
        price: 55000, priceStr: '₹55,000',
        colors: ['Oat', 'Camel'],
        sizes: ['One Size'],
        tag: 'Limited',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
        description: 'Woven from Grade-A Mongolian cashmere, the Cloud Wrap lives up to its name. Its oversized proportions allow endless configurations: a shawl, a cape, a blanket. Each wrap takes 3 days to hand-finish. Limited to 50 pieces per season — once gone, they are gone.',
    },
    {
        id: 6, cardId: 'pc-6',
        name: 'Architectural Blazer',
        price: 75000, priceStr: '₹75,000',
        colors: ['Onyx', 'Greige', 'Deep Blue'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        tag: null,
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&auto=format&fit=crop&q=80',
        description: 'Our signature blazer, hand-tailored at our Florence atelier. The canvas interlining is sewn entirely by hand — a couture tradition that guarantees the lapels hold their precise, sculptural roll for the life of the garment. Finished with mother-of-pearl buttons and a silk pocket square.',
    },
];

// ─────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────
let cart = [];
let cartOpen = false;
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;

// ─────────────────────────────────────────────────────────────────────
// INJECT MODAL HTML
// ─────────────────────────────────────────────────────────────────────
document.body.insertAdjacentHTML('beforeend', `
  <div id="modal-overlay" class="modal-overlay">
    <div id="product-modal" class="product-modal">
      <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
      <div class="modal-inner">
        <div class="modal-img-side">
          <div class="modal-img-wrap">
            <img id="modal-img" src="" alt="" />
            <div class="modal-tag-badge" id="modal-tag-badge"></div>
          </div>
        </div>
        <div class="modal-info">
          <div class="modal-eyebrow" id="modal-eyebrow">AURUM Collection</div>
          <h2 class="modal-name" id="modal-name"></h2>
          <div class="modal-price" id="modal-price"></div>
          <p class="modal-desc" id="modal-desc"></p>
          <div class="modal-field">
            <div class="modal-field-label">Color — <span id="selected-color-label"></span></div>
            <div class="color-options" id="modal-colors"></div>
          </div>
          <div class="modal-field">
            <div class="modal-field-label">Size</div>
            <div class="size-options" id="modal-sizes"></div>
          </div>
          <button class="modal-add-btn" id="modal-add-btn">Add to Bag</button>
          <p class="modal-shipping-note">Free shipping on orders above ₹50,000 · Easy 14-day returns</p>
        </div>
      </div>
    </div>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────
// INJECT CART SIDEBAR HTML
// ─────────────────────────────────────────────────────────────────────
document.body.insertAdjacentHTML('beforeend', `
  <div id="cart-overlay" class="cart-overlay"></div>
  <div id="cart-sidebar" class="cart-sidebar">
    <div class="cart-header">
      <h3 class="cart-title">Your Bag</h3>
      <button class="cart-close-btn" id="cart-close" aria-label="Close cart">✕</button>
    </div>
    <div class="cart-items" id="cart-items">
      <div class="cart-empty" id="cart-empty">
        <div class="cart-empty-icon">∅</div>
        <p>Your bag is empty.</p>
        <a href="#collections" id="cart-shop-link">Shop the Collection →</a>
      </div>
    </div>
    <div class="cart-footer" id="cart-footer" style="display:none;">
      <div class="cart-total-row">
        <span class="cart-total-label">Subtotal</span>
        <span class="cart-total-val" id="cart-total">₹0</span>
      </div>
      <p class="cart-note">Shipping & taxes calculated on checkout via WhatsApp.</p>
      <button class="cart-whatsapp-btn" id="cart-whatsapp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Order via WhatsApp
      </button>
      <p class="cart-whatsapp-note">We confirm orders on WhatsApp within 2 hours.</p>
    </div>
  </div>
`);

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────
function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
}

// ─────────────────────────────────────────────────────────────────────
// MODAL LOGIC
// ─────────────────────────────────────────────────────────────────────
function openModal(product) {
    currentProduct = product;
    selectedColor = product.colors[0];
    selectedSize = product.sizes[0];

    // Populate modal
    const img = document.getElementById('modal-img');
    img.src = product.image;
    img.alt = product.name;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-price').textContent = product.priceStr;
    document.getElementById('modal-desc').textContent = product.description;

    const tagBadge = document.getElementById('modal-tag-badge');
    if (product.tag) {
        tagBadge.textContent = product.tag;
        tagBadge.style.display = 'block';
    } else {
        tagBadge.style.display = 'none';
    }

    // Color options
    const colorsCont = document.getElementById('modal-colors');
    const colorLabel = document.getElementById('selected-color-label');
    colorLabel.textContent = selectedColor;
    colorsCont.innerHTML = product.colors.map((c, i) => `
    <button class="color-opt ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
  `).join('');
    colorsCont.querySelectorAll('.color-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedColor = btn.dataset.color;
            colorLabel.textContent = selectedColor;
            colorsCont.querySelectorAll('.color-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Size options
    const sizesCont = document.getElementById('modal-sizes');
    sizesCont.innerHTML = product.sizes.map((s, i) => `
    <button class="size-opt ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
  `).join('');
    sizesCont.querySelectorAll('.size-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedSize = btn.dataset.size;
            sizesCont.querySelectorAll('.size-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Reset add button
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.textContent = 'Add to Bag';
    addBtn.style.cssText = '';

    // Animate in
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('product-modal');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(modal, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('product-modal');
    gsap.to(modal, { y: 30, opacity: 0, duration: 0.28, ease: 'power2.in' });
    gsap.to(overlay, {
        opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
            overlay.style.display = 'none';
            if (!cartOpen) document.body.style.overflow = '';
        }
    });
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// ─────────────────────────────────────────────────────────────────────
// CART LOGIC
// ─────────────────────────────────────────────────────────────────────
function openCart() {
    cartOpen = true;
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOpen = false;
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('cart-btn')?.addEventListener('click', () => {
    if (cartOpen) closeCart(); else openCart();
});
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);
document.getElementById('cart-shop-link')?.addEventListener('click', () => {
    closeCart();
});

function addToCart(product, color, size) {
    const key = `${product.id}-${color}-${size}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ key, product, color, size, qty: 1 });
    }
    updateCartUI();
    updateCartCount();

    // Flash the bag button gold
    const cartBtn = document.getElementById('cart-btn');
    gsap.fromTo(cartBtn,
        { scale: 1.15, backgroundColor: '#c9a96e', color: '#080808', borderColor: '#c9a96e' },
        { scale: 1, backgroundColor: 'transparent', color: '#f5f0ea', borderColor: 'rgba(201,169,110,0.18)', duration: 0.7, ease: 'back.out(1.4)' }
    );
}

function updateCartCount() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.textContent = `Bag (${total})`;
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyEl);
        emptyEl.style.display = 'flex';
        footer.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    footer.style.display = 'block';

    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    totalEl.textContent = formatPrice(subtotal);

    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'none';

    cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
      <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-meta">${item.color} · ${item.size}</div>
        <div class="cart-item-price">${formatPrice(item.product.price * item.qty)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-key="${item.key}" data-action="dec">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-key="${item.key}" data-action="inc">+</button>
          <button class="remove-btn" data-key="${item.key}">Remove</button>
        </div>
      </div>
    `;
        container.appendChild(el);
    });

    // Qty controls
    container.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = cart.find(i => i.key === btn.dataset.key);
            if (!item) return;
            if (btn.dataset.action === 'inc') {
                item.qty++;
            } else {
                item.qty--;
                if (item.qty <= 0) cart = cart.filter(i => i.key !== item.key);
            }
            updateCartUI();
            updateCartCount();
        });
    });

    // Remove buttons
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cart = cart.filter(i => i.key !== btn.dataset.key);
            updateCartUI();
            updateCartCount();
        });
    });
}

// Modal "Add to Bag" button
document.getElementById('modal-add-btn').addEventListener('click', () => {
    if (!currentProduct) return;
    addToCart(currentProduct, selectedColor, selectedSize);

    const btn = document.getElementById('modal-add-btn');
    btn.textContent = '✓ Added to Bag';
    btn.style.background = '#161616';
    btn.style.color = '#c9a96e';
    btn.style.borderColor = '#c9a96e';

    setTimeout(() => {
        closeModal();
        setTimeout(() => openCart(), 380);
    }, 900);
});

// ─────────────────────────────────────────────────────────────────────
// PRODUCT CARD CLICK HANDLERS
// ─────────────────────────────────────────────────────────────────────
products.forEach(p => {
    const card = document.getElementById(p.cardId);
    if (!card) return;

    // Entire card → open modal (except the overlay-btn which adds to cart directly)
    card.addEventListener('click', e => {
        if (e.target.classList.contains('overlay-btn')) return;
        openModal(p);
    });

    // Hover "Add to Bag" overlay button → add directly to cart
    const overlayBtn = card.querySelector('.overlay-btn');
    if (overlayBtn) {
        overlayBtn.addEventListener('click', e => {
            e.stopPropagation();
            addToCart(p, p.colors[0], p.sizes[0]);
            openCart();
        });
    }
});

// ─────────────────────────────────────────────────────────────────────
// WHATSAPP ORDER
// ─────────────────────────────────────────────────────────────────────
document.getElementById('cart-whatsapp').addEventListener('click', () => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const lines = cart.map(
        i => `• ${i.product.name} (${i.color}, Size: ${i.size}) × ${i.qty} = ${formatPrice(i.product.price * i.qty)}`
    );

    const message = [
        'Hello AURUM! 👋 I would like to place an order:',
        '',
        ...lines,
        '',
        `Subtotal: ${formatPrice(subtotal)}`,
        '',
        'Please confirm availability and share shipping details. Thank you!',
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});

// ─────────────────────────────────────────────────────────────────────
// EMAIL SUBSCRIBE via Formspree
// ─────────────────────────────────────────────────────────────────────
document.getElementById('subscribe-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('email-input');
    const btn = document.getElementById('subscribe-btn');
    const email = input?.value?.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
        input.style.borderColor = '#ff4444';
        input.placeholder = 'Enter a valid email address';
        gsap.fromTo(input, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'your@email.com';
        }, 2500);
        return;
    }

    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // If Formspree ID is set up, use it
    if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ email, _subject: `New AURUM Subscriber: ${email}` }),
            });
            if (!res.ok) throw new Error('Formspree error');
            input.value = '';
            input.placeholder = '✓ You\'re on the inner circle list!';
            input.style.borderColor = '#c9a96e';
            btn.textContent = 'Joined ✓';
            btn.style.background = '#1a1a1a';
            btn.style.color = '#c9a96e';
            return;
        } catch {
            // Fall through to mailto fallback
        }
    }

    // Fallback: open mailto
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=Newsletter%20Subscription&body=Please%20add%20${encodeURIComponent(email)}%20to%20the%20AURUM%20newsletter.`;
    btn.textContent = original;
    btn.disabled = false;
    input.value = '';
    input.placeholder = '✓ Email app opened — send to subscribe!';
    input.style.borderColor = '#c9a96e';
});

console.log('✦ AURUM UI — All interactive features loaded');
