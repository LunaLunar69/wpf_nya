//Service Worker

if('serviceWorker' in navigator) {
    console.log('Puedes usar los ServiceWorkers en tu navegador');

    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Registro de SW exitoso', reg))
    .catch(err => console.warn('Error al registrar el SW', err));

}else{
    console.log('No puedes usar los serviceWorkers en tu navegador');
}

// Scroll suavizado
$(document).ready(function(){

    $("#menu a").click(function(e){
        e.preventDefault();

        $("html, body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
});


// =========================
// Supabase: inicialización
// =========================
const { createClient } = supabase;

// PON AQUÍ TUS DATOS REALES
const supabaseUrl = 'https://bpkzvxpnxriaeziwlfte.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa3p2eHBueHJpYWV6aXdsZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjY4NjcsImV4cCI6MjA3OTY0Mjg2N30.Cd3FKJ8r72sAKe1oGDLdLzBY-zxhxUsj8EMSN37xNcM';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// =========================
// Lógica del formulario
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('opinion-form');
    const msg = document.getElementById('opinion-msg');
    const lista = document.getElementById('opiniones-lista');
    const btn = document.getElementById('btn-enviar');

    if (!form) return; // por si esta página no lo tiene

    // Cargar opiniones al inicio
    cargarOpiniones();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = '';
        btn.disabled = true;

        const nickname = document.getElementById('nickname').value.trim();
        const operador = document.getElementById('operador').value;
        const comentario = document.getElementById('comentario').value.trim();

        if (!nickname || !operador) {
            msg.textContent = 'Llena al menos nickname y operador.';
            btn.disabled = false;
            return;
        }

        // Insertar en Supabase
        const { data, error } = await supabaseClient
            .from('r6_opiniones')
            .insert([{ nickname, operador, comentario }])
            .select();

        if (error) {
            console.error(error);
            msg.textContent = 'Error al enviar la opinión 😢';
        } else {
            msg.textContent = 'Opinión enviada 🎮';
            form.reset();
            // Volver a cargar lista
            await cargarOpiniones();
        }

        btn.disabled = false;
    });

    async function cargarOpiniones() {
        lista.innerHTML = 'Cargando opiniones...';

        const { data, error } = await supabaseClient
            .from('r6_opiniones')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error(error);
            lista.innerHTML = '<p>Error al cargar las opiniones.</p>';
            return;
        }

        if (!data || data.length === 0) {
            lista.innerHTML = '<p>Aún no hay opiniones. ¡Sé el primero en comentar!</p>';
            return;
        }

        lista.innerHTML = '';
        data.forEach((op) => {
            const card = document.createElement('div');
            card.className = 'opinion-card';

            const header = document.createElement('div');
            header.className = 'opinion-card-header';

            const nickSpan = document.createElement('span');
            nickSpan.className = 'opinion-card-nick';
            nickSpan.textContent = op.nickname + ' (' + op.operador + ')';

            const fechaSpan = document.createElement('span');
            if (op.created_at) {
                const d = new Date(op.created_at);
                fechaSpan.textContent = d.toLocaleString('es-MX');
            } else {
                fechaSpan.textContent = '';
            }

            header.appendChild(nickSpan);
            header.appendChild(fechaSpan);

            const cuerpo = document.createElement('p');
            cuerpo.textContent = op.comentario || 'Sin comentario';

            card.appendChild(header);
            card.appendChild(cuerpo);

            lista.appendChild(card);
        });
    }
});