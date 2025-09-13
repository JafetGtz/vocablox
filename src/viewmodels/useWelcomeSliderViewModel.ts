// src/viewmodels/useWelcomeSliderViewModel.ts

import { useState } from 'react'

export const useWelcomeSliderViewModel = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const slides = [
        {
            id: '1',
            title1: 'TU',
            title2: 'PERSONAL',
            title3: 'VOCABULARIO',
            description:
                'Una app simple pero muy útil para ti. Un pequeño diccionario te ayudará a aprender cualquier idioma que quieras.',
        },
        {
            id: '2',
            title1: 'APRENDE',
            title2: 'PALABRAS',
            title3: 'EXCLUSIVAS',
            description:
                'Guarda y revisa vocabulario adaptado a tu profesión o intereses, siempre a mano.',
        },
        {
            id: '3',
            title1: 'HAZLO',
            title2: 'A TU',
            title3: 'RITMO',
            description:
                'Con juegos, ejercicios y recordatorios que te motivan cada día.',
        },
    ]

    return { slides, currentIndex, setCurrentIndex }
}
