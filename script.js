// 1. DATABASE CONFIG (Get these from Supabase)
const SB_URL = 'https://jzngqqqxjpyfopbwcvtn.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bmdxcXF4anB5Zm9wYndjdnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MjQwNDMsImV4cCI6MjA4ODMwMDA0M30.7aq_y_WR62veiHZJJgjBbDeSfelb7C84O7xKsrKR5Sg';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

const form = document.getElementById('petition-form');
const sigList = document.getElementById('signature-list');
const totalCounter = document.getElementById('total-count');

// 2. CHECK LOCAL STORAGE (Prevent double signing)
if (localStorage.getItem('petition_signed')) {
    form.classList.add('hidden');
    document.getElementById('success-area').classList.remove('hidden');
}

// 3. LOAD DATA FROM CLOUD
async function fetchSignatures() {
    const { data, error } = await _supabase
        .from('petition_signs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        sigList.innerHTML = "Error connecting to cloud.";
        return;
    }

    totalCounter.innerText = data.length;
    sigList.innerHTML = data.map(s => `
        <div class="sig-item">
            <strong>${s.name}</strong>
            ${s.comment ? `<p>"${s.comment}"</p>` : ''}
        </div>
    `).join('');
}

// 4. SAVE NEW SIGNATURE
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerText = "Signing...";

    const name = document.getElementById('user-name').value;
    const comment = document.getElementById('user-comment').value;

    const { error } = await _supabase
        .from('petition_signs')
        .insert([{ name, comment }]);

    if (!error) {
        localStorage.setItem('petition_signed', 'true');
        form.classList.add('hidden');
        document.getElementById('success-area').classList.remove('hidden');
        fetchSignatures();
    } else {
        alert("Failed to save. Check your database setup.");
        btn.disabled = false;
        btn.innerText = "Add My Signature";
    }
});

fetchSignatures();
