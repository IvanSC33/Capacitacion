/*
ADRYAN Academy - Mock Data Layer

Este archivo simula la respuesta de APIs backend.
En producción estos datos provendrán de:
GET /api/academy/modules
GET /api/academy/courses
GET /api/academy/quiz
GET /api/academy/progress
*/

ADRYAN.Data = {
    modules: [
        { id: 'vacaciones', title: 'Módulo Vacaciones', icon: 'fa-umbrella-beach', desc: 'Aprende a gestionar integralmente los flujos de aprobación, saldos y registro de descansos vacacionales.', color: '#0d6efd', tags: ['Procesos'] },
        { id: 'planillas', title: 'Módulo Planillas', icon: 'fa-file-invoice-dollar', desc: 'Domina los procesos de remuneración, cálculos legales, impuestos y generación de boletas de pago.', color: '#198754', tags: ['Nómina'] },
        { id: 'carga-masiva', title: 'Carga Masiva (Integridad)', icon: 'fa-database', desc: 'Conoce la jerarquía exacta y los pasos para migrar información de forma segura a Adryan Cloud.', color: '#6f42c1', tags: ['Técnico'] },
        { id: 'perfiles', title: 'Gestión de Perfiles', icon: 'fa-user-shield', desc: 'Administración de roles, permisos, unidades funcionales y seguridad del sistema.', color: '#dc3545', tags: ['Seguridad'] },
        { id: 'organizacion', title: 'Estructura Organizacional', icon: 'fa-sitemap', desc: 'Mantenimiento de puestos, centros de costo, sucursales y organigramas empresariales.', color: '#0dcaf0', tags: ['Maestros'] }
    ],
    courses: {
        'vacaciones': [
            { id: 'v1', title: 'Manual Técnico: Gestión de Perfiles', type: 'Guía Interactiva', time: '10 min', isQuiz: false, cup: false, simUrl: '/simulators/sim-perfiles.html' },
            { id: 'v2', title: 'Simulador: Flujo de Aprobación', type: 'Simulador Asistido', time: '15 min', isQuiz: false, cup: true, simUrl: '/simulators/sim-flujo.html' },
            { id: 'v3', title: 'Evaluación Final Vacaciones', type: 'Examen', time: '10 min', isQuiz: true, cup: true }
        ],
        'carga-masiva': [
            { id: 'c1', title: 'Simulador Integral de Carga Masiva', type: 'Simulador Práctico', time: '20 min', isQuiz: false, cup: true, simUrl: '/simulators/sim-carga.html' },
            { id: 'c2', title: 'Auditoría de Errores', type: 'Examen', time: '10 min', isQuiz: true, cup: true }
        ],
        'planillas': [
            { id: 'p1', title: 'Introducción a Planillas', type: 'Video', time: '15 min', isQuiz: false, cup: false, simUrl: null }
        ],
        'perfiles': [],
        'organizacion': []
    },
    quizzes: {
        'v3': [
            { q: '¿Qué paso es indispensable para que el Administrador reciba correos?', options: ['Asignar la secuencia 3', 'Crear el usuario', 'Llenar Excel'], correct: 0 },
            { q: '¿Qué regla aplica automáticamente ADRYAN al solicitar vacaciones?', options: ['3x1', '5x2', '7x0'], correct: 1 }
        ],
        'c2': [
            { q: '¿Qué sucede si hay un error de constraint referencial?', options: ['Ignora el error', 'Falta cargar catálogos previos (Nivel 2)', 'El formato de fecha está mal'], correct: 1 }
        ]
    }
};
