/* ==========================================================================
   chatbot.js — HANDNOVA
   Asistente virtual basado en reglas (sin IA / sin llamadas a servidor).
   Detecta palabras clave en la pregunta del usuario y responde con
   respuestas predefinidas sobre LSC, la plataforma, categorías, juegos,
   cuenta y progreso. Se incluye en TODAS las páginas junto a
   gamification.js y dibuja su propia burbuja flotante con JS puro,
   así no hay que tocar el HTML de cada página.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. BASE DE CONOCIMIENTO
   *    Cada entrada tiene varias frases disparadoras (p) y una
   *    respuesta (r). Se busca coincidencia por inclusión de texto,
   *    ignorando tildes/mayúsculas, y gana la frase más larga que
   *    coincida (más específica).
   * ------------------------------------------------------------------ */
  const BASE = [

    /* ---- 1. Saludos y sobre el bot ---- */
    { p: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal'],
      r: '¡Hola! 👋 Soy el asistente de HANDNOVA. Puedo ayudarte con dudas sobre la Lengua de Señas Colombiana, las categorías, los juegos, tu cuenta y tu progreso. ¿Qué necesitas?' },
    { p: ['quien eres', 'que eres', 'eres una ia', 'eres un robot', 'eres humano', 'con quien hablo'],
      r: 'Soy un asistente de reglas de HANDNOVA: reconozco palabras clave en tu mensaje y te respondo con información predefinida sobre la plataforma. No soy una IA generativa, así que funciono mejor con preguntas cortas y directas 🙂' },
    { p: ['que puedes hacer', 'para que sirves', 'en que me ayudas', 'ayuda', 'necesito ayuda', 'que sabes hacer'],
      r: 'Puedo orientarte sobre: qué es la LSC, cómo usar las categorías, el abecedario, el buscador, los juegos (Quiz, Busca Parejas, Contrarreloj, Deletreo), tu cuenta, tu progreso, tu racha, tu XP, tus logros, el modo oscuro y los servicios institucionales. Pregúntame por cualquiera de esos temas o por el nombre de una seña.' },
    { p: ['gracias', 'muchas gracias', 'te lo agradezco', 'genial gracias'],
      r: '¡Con gusto! Si te surge otra duda mientras aprendes, aquí estaré 👋' },
    { p: ['adios', 'chao', 'nos vemos', 'hasta luego', 'bye'],
      r: '¡Hasta luego! Sigue practicando tu LSC 💪 Puedes volver a abrirme cuando quieras, tu conversación queda guardada.' },
    { p: ['quien te creo', 'quien te programo', 'como funcionas', 'eres inteligencia artificial'],
      r: 'Soy un chatbot basado en reglas: comparo tu mensaje contra una lista de palabras clave y te devuelvo la respuesta asociada. No entiendo lenguaje natural complejo, así que si no te respondo bien, intenta con menos palabras o términos más directos.' },

    /* ---- 2. Sobre la Lengua de Señas Colombiana (LSC) ---- */
    { p: ['que es lsc', 'que es la lengua de senas colombiana', 'que significa lsc', 'lsc'],
      r: 'LSC es la Lengua de Señas Colombiana: la lengua natural de la comunidad sorda en Colombia. Tiene su propia gramática, distinta a la del español, y se expresa con las manos, el cuerpo y expresiones faciales.' },
    { p: ['es un idioma oficial', 'la lsc es oficial en colombia', 'esta reconocida por la ley'],
      r: 'Sí. La Ley 324 de 1996 y la Ley 982 de 2005 reconocen la Lengua de Señas Colombiana como la lengua propia de la comunidad sorda del país.' },
    { p: ['por que aprender lsc', 'para que sirve aprender senas', 'por que aprender senas'],
      r: 'Aprender LSC te permite comunicarte con la comunidad sorda de Colombia, generar entornos más inclusivos y romper barreras de comunicación en la familia, la escuela o el trabajo.' },
    { p: ['cuantas personas sordas hay en colombia', 'cuanta gente usa lsc'],
      r: 'Se estima que en Colombia hay más de 500.000 personas con discapacidad auditiva, y unas 2.000 solo en la provincia del Sumapaz, muchas de las cuales usan la LSC como su lengua principal de comunicación.' },
    { p: ['la lsc es igual al espanol', 'la lsc tiene la misma gramatica del espanol', 'lsc es como escribir en el aire'],
      r: 'No. La LSC no es "español con las manos": tiene su propia gramática, orden de palabras y estructura, igual que cualquier otro idioma. No es una traducción literal del español.' },
    { p: ['la lsc es igual en todos los paises', 'la lengua de senas es universal', 'existe una sola lengua de senas'],
      r: 'No existe una lengua de señas universal. Cada país (o incluso región) suele tener la suya: LSC en Colombia, ASL en Estados Unidos, LSE en España, etc. Todas son independientes entre sí.' },
    { p: ['que es el alfabeto dactilologico', 'que es dactilologico', 'deletrear con las manos'],
      r: 'El alfabeto dactilológico es el conjunto de señas que representan cada letra del abecedario con la mano. Se usa para deletrear nombres propios, siglas o palabras que aún no tienen una seña establecida en LSC. Puedes practicarlo en la sección Abecedario o en el juego de Deletreo.' },
    { p: ['que es la comunidad sorda', 'quienes son la comunidad sorda'],
      r: 'La comunidad sorda es el conjunto de personas sordas que comparten la LSC como lengua e identidad cultural propia. No se ven a sí mismas como "personas con discapacidad que no oyen", sino como una comunidad lingüística y cultural.' },
    { p: ['necesito saber espanol para aprender lsc', 'necesito experiencia previa'],
      r: 'No necesitas experiencia previa. HANDNOVA está pensado para estudiantes, familias y cualquier persona que quiera empezar desde cero a comunicarse en LSC.' },
    { p: ['que es una glosa', 'que es glosar'],
      r: 'Una glosa es la forma de escribir una seña usando palabras en mayúscula del español, solo como referencia (por ejemplo: YO CASA IR). No es una traducción literal, es solo una anotación para representar la seña por escrito.' },
    { p: ['la lsc tiene expresiones faciales', 'las expresiones faciales importan en lsc'],
      r: 'Sí, las expresiones faciales son parte fundamental de la gramática de la LSC: pueden cambiar el significado de una seña, indicar preguntas, negaciones o intensidad, igual que la entonación en el español hablado.' },
    { p: ['puedo aprender lsc solo con videos', 'es suficiente con la plataforma para aprender lsc'],
      r: 'HANDNOVA es un excelente punto de partida para familiarizarte con el vocabulario y la lógica de la LSC, pero para dominarla te recomendamos también practicar con la comunidad sorda o tomar cursos certificados con intérpretes.' },
    { p: ['que es fenascol', 'que es la federacion de sordos'],
      r: 'FENASCOL (Federación Nacional de Sordos de Colombia) es la organización que representa a la comunidad sorda colombiana y promueve el uso y reconocimiento de la LSC.' },
    { p: ['que es insor', 'que hace el insor'],
      r: 'El INSOR (Instituto Nacional para Sordos) es la entidad del Estado colombiano encargada de liderar la política pública de inclusión social de las personas sordas en Colombia.' },
    { p: ['la lsc varia segun la region', 'hay dialectos de la lsc'],
      r: 'Sí, como en cualquier lengua, la LSC puede tener variaciones regionales en algunas señas dentro de Colombia, aunque comparte una gramática y estructura común.' },

    /* ---- 3. Sobre la plataforma HANDNOVA ---- */
    { p: ['que es HANDNOVA', 'que es esta pagina', 'que es esta plataforma', 'de que trata HANDNOVA'],
      r: 'HANDNOVA es una plataforma web para aprender Lengua de Señas Colombiana (LSC) con videos reales, organizados por categorías, además de un abecedario, juegos, un buscador de señas y seguimiento de tu progreso.' },
    { p: ['es gratis', 'cuesta dinero', 'tiene algun costo', 'debo pagar'],
      r: 'Para estudiantes y personas particulares, HANDNOVA es de acceso libre y sin costo. Solo las instituciones que quieran licencias personalizadas (ver "Servicios") manejan un modelo distinto.' },
    { p: ['quien hizo HANDNOVA', 'quien creo esta pagina', 'quien desarrollo esto'],
      r: 'HANDNOVA es un proyecto formativo desarrollado en el marco del SENA (Análisis y Desarrollo de Software), con el objetivo de acercar la Lengua de Señas Colombiana a más personas.' },
    { p: ['necesito internet', 'funciona sin internet', 'funciona offline'],
      r: 'Necesitas conexión a internet, ya que los videos de las señas, el catálogo de búsqueda y el inicio de sesión se cargan desde la web.' },
    { p: ['funciona en el celular', 'funciona en movil', 'tiene aplicacion', 'hay app para descargar'],
      r: 'HANDNOVA funciona directamente desde el navegador y su diseño se adapta a celular, tablet y computador. No necesitas descargar ninguna aplicación.' },
    { p: ['tengo que registrarme para usar la pagina', 'necesito crear cuenta para ver las lecciones'],
      r: 'Puedes explorar las categorías, el abecedario, el buscador y los juegos sin necesidad de registrarte. Crear una cuenta es solo necesario si quieres guardar tu progreso, tu racha y tus logros en la nube.' },
    { p: ['que secciones tiene HANDNOVA', 'que puedo hacer en HANDNOVA', 'que opciones tiene el menu'],
      r: 'El menú principal tiene: Inicio, Categorías (lecciones por tema), Abecedario, Buscar (encuentra una seña por palabra), Cuenta, y en "Más": Juego, Quiz, Progreso y Servicios.' },
    { p: ['HANDNOVA sirve para interpretes', 'sirve para nivel avanzado'],
      r: 'HANDNOVA está pensado principalmente para principiantes: vocabulario básico por categorías, el abecedario y práctica con juegos. Es un buen primer paso antes de una formación más avanzada o certificada.' },
    { p: ['en que colores esta el logo', 'de que color es HANDNOVA'],
      r: 'La identidad visual de HANDNOVA usa un degradado de magenta, morado y cian, tanto en el logo como en los acentos de la interfaz.' },
    { p: ['en que lenguaje esta hecho HANDNOVA', 'con que tecnologia esta hecho'],
      r: 'El frontend está hecho en HTML, CSS y JavaScript puro (sin frameworks). Las cuentas y la sincronización de progreso usan Firebase (Authentication + Firestore), y el catálogo de señas para buscador y juegos se maneja con un archivo JSON.' },
    { p: ['mis datos estan seguros', 'donde se guardan mis datos', 'que base de datos usa HANDNOVA'],
      r: 'Tu cuenta se maneja con Firebase Authentication, y tu progreso (racha, XP, logros) se guarda tanto en el navegador (localStorage) como sincronizado en Firestore si tienes sesión iniciada, para que lo veas igual en distintos dispositivos.' },
    { p: ['puedo contribuir al proyecto', 'como colaboro con HANDNOVA'],
      r: 'HANDNOVA es un proyecto formativo; si quieres colaborar o sugerir mejoras, lo mejor es contactar directamente a quienes lo desarrollan.' },

    /* ---- 4. Categorías / lecciones ---- */
    { p: ['que son las categorias', 'como funcionan las categorias', 'para que sirven las categorias', 'que hay en categorias', 'categorias', 'que categorias hay'],
      r: 'Las categorías agrupan señas por tema (Saludos, Familia, Colores, etc.). Cada una tiene una lista de videos cortos con la seña de cada palabra, para que aprendas por bloques de vocabulario relacionado.' },
    { p: ['cuantas categorias hay', 'cuantos temas hay disponibles'],
      r: 'En "Categorías" se listan 22 temas en total, repartidos en 2 páginas. De esos, 10 ya tienen todo su vocabulario disponible en video (Saludos, Familia, Emociones, Profesiones, Escuela, Vida diaria, Comida, Colores, Cuerpo humano y Animales). Deportes y Salud tienen una parte de sus señas ya disponibles, y el resto (Hogar, Números, Ropa, Transporte, Fechas y tiempo, Lugares y ciudad, Tecnología, Naturaleza y clima, Verbos comunes, Adjetivos comunes) todavía está en construcción. El Abecedario es una sección aparte.' },
    { p: ['que categorias estan completas', 'que categorias tienen todos los videos', 'que categorias funcionan bien'],
      r: 'Las 10 categorías con todo su vocabulario ya en video son: Saludos, Familia, Emociones, Profesiones, Escuela, Vida diaria, Comida, Colores, Cuerpo humano y Animales.' },
    { p: ['que categorias estan en construccion', 'que categorias faltan', 'que categorias no tienen videos', 'que categorias estan incompletas', 'proximamente'],
      r: 'Hogar, Números, Ropa, Transporte, Fechas y tiempo, Lugares y ciudad, Tecnología, Naturaleza y clima, Verbos comunes y Adjetivos comunes aparecen en "Categorías" pero todavía están en construcción, sin videos reales por ahora. Deportes y Salud sí tienen una parte de sus señas ya disponibles, el resto marcado como "próximamente".' },
    { p: ['cuantas senas hay en total', 'cuantas palabras hay disponibles', 'cuantos videos de senas hay'],
      r: 'Actualmente hay 77 señas disponibles en video repartidas en las categorías activas, más las 27 letras del Abecedario.' },
    { p: ['como veo una categoria', 'como entro a una leccion', 'donde encuentro las lecciones'],
      r: 'Ve al menú y toca "Categorías". Ahí verás tarjetas con cada tema, en 2 páginas; al tocar una entras a la lección y ves los videos de las señas de esa categoría.' },
    { p: ['que hay en saludos', 'que se aprende en la categoria saludos', 'saludos'],
      r: 'En la categoría Saludos encuentras 5 señas: Hola, Buenos días, Buenas tardes, Buenas noches y ¿Cómo estás?' },
    { p: ['que hay en familia', 'que se aprende en la categoria familia', 'familia'],
      r: 'En la categoría Familia encuentras 5 señas: Abuelo, Mamá, Papá, Hijo y Familia.' },
    { p: ['que hay en emociones', 'que se aprende en la categoria emociones', 'emociones'],
      r: 'En la categoría Emociones encuentras 6 señas: Amor, Feliz, Desagrado, Ira, Sorpresa y Triste.' },
    { p: ['que hay en profesiones', 'que se aprende en la categoria profesiones', 'profesiones'],
      r: 'En la categoría Profesiones encuentras 6 señas: Profesor, Cantante, Enfermera, Ingeniero, Policía y Psicólogo.' },
    { p: ['que hay en escuela', 'que se aprende en la categoria escuela', 'escuela'],
      r: 'En la categoría Escuela encuentras 5 señas: Cuaderno, Colegio, Colores (útiles escolares), Esfero y Maleta.' },
    { p: ['que hay en vida diaria', 'que se aprende en la categoria vida diaria', 'vida diaria'],
      r: 'En la categoría Vida diaria encuentras 5 señas: Casa, Dormir, Trabajar, Caminar y Tiempo. ("Comer" todavía no tiene video disponible en esta categoría).' },
    { p: ['que hay en comida', 'que se aprende en la categoria comida', 'comida'],
      r: 'En la categoría Comida encuentras 12 señas: Almuerzo, Caliente, Cena, Desayunar, Hambre, Sopa, Pescado, Pollo, Carne, Arroz, Pasta y Frío.' },
    { p: ['que hay en colores', 'que se aprende en la categoria colores', 'senas de colores', 'colores'],
      r: 'En la categoría Colores encuentras 7 señas: Rojo, Azul, Amarillo, Negro, Blanco, Rosado y Naranja.' },
    { p: ['que hay en cuerpo humano', 'que se aprende en la categoria cuerpo', 'cuerpo humano'],
      r: 'En la categoría Cuerpo humano encuentras 6 señas: Cabeza, Brazos, Pies, Manos, Boca y Ojo.' },
    { p: ['que hay en animales', 'que se aprende en la categoria animales', 'animales'],
      r: 'En la categoría Animales encuentras 6 señas: Perro, Gato, Loro, Vaca, Caballo y Tiburón.' },
    { p: ['que hay en deportes', 'que se aprende en la categoria deportes', 'deportes'],
      r: 'En la categoría Deportes ya hay 7 señas disponibles: Fútbol, Baloncesto, Béisbol, Boxeo, Tenis, Vela y Fútbol americano. Voleibol, Natación, Ciclismo, Correr, Nadar, Ganar, Perder y Jugador todavía aparecen como "próximamente".' },
    { p: ['que hay en salud', 'que se aprende en la categoria salud', 'salud'],
      r: 'En la categoría Salud ya hay señas disponibles como Fiebre, Gripa, Asma, Cáncer, Mareo, Pastillas y Cirugía (Enfermera y Psicólogo también aparecen ahí, aunque los ves principalmente en Profesiones). Médico, Hospital, Farmacia, Medicina, Dolor, Gripe, Vacuna, Cita médica y Discapacidad todavía están en construcción.' },
    { p: ['que hay en hogar', 'que se aprende en la categoria hogar', 'categoria hogar'],
      r: 'La categoría Hogar (Cocina, Sala, Baño, Mesa, Cama, etc.) aún está en construcción y por ahora no tiene señas en video disponibles. La seña de "Casa" sí puedes verla ya, dentro de la categoría Vida diaria.' },
    { p: ['que hay en numeros', 'categoria numeros', 'senas de numeros'],
      r: 'La categoría Números (Cero, Uno, Dos... hasta Mil) está anunciada en "Categorías" pero todavía en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en ropa', 'categoria ropa', 'senas de ropa'],
      r: 'La categoría Ropa (Camisa, Pantalón, Zapatos, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en transporte', 'categoria transporte'],
      r: 'La categoría Transporte (Carro, Bus, Moto, Avión, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en fechas y tiempo', 'categoria fechas', 'dias de la semana en senas'],
      r: 'La categoría Fechas y tiempo (días de la semana, Hoy, Ayer, Mañana, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en lugares y ciudad', 'categoria lugares'],
      r: 'La categoría Lugares y ciudad (Parque, Banco, Hospital, Restaurante, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en tecnologia', 'categoria tecnologia'],
      r: 'La categoría Tecnología (Computador, Celular, Internet, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en naturaleza y clima', 'categoria naturaleza'],
      r: 'La categoría Naturaleza y clima (Sol, Lluvia, Montaña, Mar, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en verbos comunes', 'categoria verbos'],
      r: 'La categoría Verbos comunes (Hablar, Escuchar, Leer, Jugar, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['que hay en adjetivos comunes', 'categoria adjetivos'],
      r: 'La categoría Adjetivos comunes (Grande, Rápido, Fácil, Limpio, etc.) todavía está en construcción, sin videos disponibles por ahora.' },
    { p: ['no encuentro una palabra en las categorias', 'una palabra no esta en ninguna categoria'],
      r: 'Si no encuentras una palabra dentro de las categorías, prueba en la sección "Buscar": ahí puedes escribir cualquier palabra y ver si existe su video. Si tampoco aparece, seguramente aún no está disponible en la plataforma.' },

    /* ---- 5. Abecedario ---- */
    { p: ['que es el abecedario', 'para que sirve la seccion abecedario', 'abecedario'],
      r: 'La sección Abecedario muestra en video cómo se hace cada letra con la mano (alfabeto dactilológico), de la A a la Z, incluyendo la Ñ.' },
    { p: ['cuantas letras tiene el abecedario', 'cuantas letras hay en la seccion abecedario'],
      r: 'El Abecedario de HANDNOVA tiene las 27 letras del alfabeto español, incluida la Ñ.' },
    { p: ['donde encuentro el abecedario', 'como entro al abecedario'],
      r: 'Puedes entrar al Abecedario desde el menú principal, entre "Categorías" y "Buscar".' },
    { p: ['para que sirve saber el abecedario en senas', 'para que sirve el alfabeto dactilologico'],
      r: 'El abecedario en señas (dactilológico) se usa para deletrear palabras que no tienen una seña propia, como nombres, siglas o palabras nuevas. Es una herramienta base antes de aprender vocabulario completo.' },
    { p: ['el abecedario tiene la letra ene con tilde', 'esta la nn en el abecedario'],
      r: 'Sí, el abecedario incluye la letra Ñ, además de la A a la Z.' },
    { p: ['abecedario y deletreo son lo mismo', 'diferencia entre abecedario y deletreo'],
      r: 'No son lo mismo: el Abecedario es una sección de consulta, con el video de cada letra por separado. Deletreo es un juego, en la sección Práctica, donde debes deletrear palabras completas letra por letra usando ese alfabeto.' },

    /* ---- 6. Buscador ---- */
    { p: ['como busco una sena', 'como funciona el buscador', 'como uso buscar', 'buscar', 'buscador'],
      r: 'En la sección "Buscar" escribes cualquier palabra en el cuadro de búsqueda y, si existe en el catálogo, verás su video en LSC al instante.' },
    { p: ['donde esta el buscador', 'donde encuentro buscar'],
      r: 'La sección "Buscar" está en el menú principal, con el ícono de una lupa.' },
    { p: ['que pasa si busco una palabra que no existe', 'no aparece la palabra que busque'],
      r: 'Si buscas una palabra que aún no está en el catálogo de señas de HANDNOVA, el buscador te avisará que no encontró resultados. Puedes intentar con sinónimos o revisar las categorías disponibles.' },
    { p: ['el buscador necesita internet', 'el buscador funciona sin conexion'],
      r: 'Sí, el buscador necesita conexión a internet para cargar el catálogo de señas y los videos.' },
    { p: ['antes se llamaba traductor', 'donde quedo el traductor'],
      r: 'Esa función ahora se llama "Buscar" en el menú (antes decía "Traductor"). Hace lo mismo: encuentras el video de una seña escribiendo la palabra.' },
    { p: ['el buscador traduce frases completas', 'puedo traducir un texto completo'],
      r: 'No, el buscador funciona por palabras individuales, no traduce frases u oraciones completas a LSC.' },
    { p: ['buscar palabras que no tienen video todavia', 'que pasa si busco una palabra proximamente'],
      r: 'Si buscas una palabra que ya está en el catálogo pero aún no tiene video grabado, el buscador te muestra la ficha con la categoría a la que pertenece y la marca como "próximamente" en vez de reproducir un video.' },

    /* ---- 7. Juegos: overview ---- */
    { p: ['que juegos hay', 'que juegos tiene HANDNOVA', 'donde estan los juegos', 'juegos'],
      r: 'HANDNOVA tiene 4 juegos: Quiz (preguntas de opción múltiple por dificultad), Busca Parejas o "Juego de memoria" (relacionar palabra y video), Contrarreloj (adivina la seña antes de que se acabe el tiempo) y Deletreo (arma la palabra letra por letra). Quiz tiene su propio ícono en el menú "Más"; los otros tres están dentro de "Juego".' },
    { p: ['como entro a los juegos', 'donde esta la seccion de juegos'],
      r: 'Ve al menú "Más" y toca "Juego"; ahí verás 3 opciones: Juego de memoria (Busca Parejas), Deletreo y Contrarreloj. El Quiz tiene su propio acceso directo en "Más".' },
    { p: ['los juegos sirven para practicar', 'para que sirven los juegos'],
      r: 'Los juegos son una forma divertida de repasar el vocabulario que ya viste en las categorías, reforzando la memoria visual de cada seña.' },
    { p: ['hay tabla de puntajes', 'hay ranking en los juegos', 'se guardan los puntajes'],
      r: 'Tus mejores puntajes se guardan en tu progreso local (por ejemplo, tu mejor puntaje de Quiz, Contrarreloj o Deletreo), y algunos de ellos desbloquean logros.' },

    /* ---- 7b. Quiz ---- */
    { p: ['como funciona el quiz', 'como se juega el quiz', 'quiz', 'uso el juego de quiz'],
      r: 'En el Quiz eliges una dificultad (Fácil, Normal, Difícil o Experto) y respondes preguntas de opción múltiple que mezclan categorías y abecedario, contra un tiempo límite por pregunta.' },
    { p: ['que dificultades tiene el quiz', 'cuantos niveles tiene el quiz'],
      r: 'El Quiz tiene 4 niveles: Fácil (5 preguntas, 25s cada una, aprobar con 50%), Normal (8 preguntas, 15s, 60%), Difícil (12 preguntas, 10s, 70%) y Experto (16 preguntas, 6s, 80%). Los niveles más altos se recomiendan tras aprobar el anterior, aunque no es obligatorio.' },
    { p: ['puedo elegir la categoria del quiz', 'el quiz tiene categorias'],
      r: 'El Quiz mezcla preguntas de distintas categorías y del abecedario según la dificultad que elijas, en vez de dejarte escoger un solo tema.' },
    { p: ['que logro desbloquea el quiz', 'hay logro por el quiz'],
      r: 'Hay logros como "Primer quiz" (completar tu primer quiz), "Puntaje perfecto" (sacar 90% o más en un quiz) y "Nivel Experto dominado" (aprobar 3 quizzes en dificultad Experto).' },
    { p: ['que pasa si se acaba el tiempo en una pregunta del quiz', 'que pasa si no respondo a tiempo en el quiz'],
      r: 'Si se te acaba el tiempo sin responder una pregunta del Quiz, esa pregunta cuenta como no respondida y pasas a la siguiente automáticamente.' },

    /* ---- 7c. Busca Parejas / juego.html ---- */
    { p: ['como funciona busca parejas', 'como se juega busca parejas', 'que es el juego de parejas', 'parejas', 'busca parejas', 'juego de memoria'],
      r: 'En Busca Parejas (también llamado "Juego de memoria") debes encontrar la palabra que corresponde a cada video de seña, eligiendo primero la categoría que quieres practicar.' },
    { p: ['busca parejas tiene categorias', 'puedo elegir tema en busca parejas'],
      r: 'Sí, antes de jugar eliges la categoría cuyas señas quieres practicar en el juego de Busca Parejas.' },

    /* ---- 7d. Contrarreloj ---- */
    { p: ['como funciona contrarreloj', 'como se juega contrarreloj', 'que es contrarreloj', 'contrarreloj'],
      r: 'En Contrarreloj se muestra un video con una seña y debes elegir la palabra correcta antes de que se acabe el tiempo, en 10 rondas seguidas. Si encadenas aciertos, multiplicas tu puntaje con combos.' },
    { p: ['que es un combo en contrarreloj', 'como sumo combo'],
      r: 'Un combo se forma cuando aciertas varias respuestas seguidas sin fallar en Contrarreloj: desde 3 aciertos seguidos el multiplicador sube a x2, y desde 5 sube a x3. Fallar una ronda reinicia el combo a cero.' },
    { p: ['contrarreloj tiene limite de tiempo', 'cuanto tiempo tengo para responder'],
      r: 'Sí, en Contrarreloj tienes un tiempo limitado para responder cada seña, que empieza en 7 segundos y se va reduciendo un poco en cada ronda (hasta un mínimo de 3.2 segundos) para subir la dificultad; si se acaba, pierdes esa ronda.' },
    { p: ['cuantas rondas tiene contrarreloj', 'cuantas preguntas tiene contrarreloj'],
      r: 'El reto de Contrarreloj tiene 10 rondas en total.' },
    { p: ['contrarreloj tiene vidas', 'pierdo vidas en contrarreloj'],
      r: 'No, Contrarreloj no usa vidas: puedes fallar una ronda y sigues jugando hasta completar las 10, pero perder reinicia tu combo de puntos a cero.' },

    /* ---- 7e. Deletreo ---- */
    { p: ['como funciona deletreo', 'como se juega deletreo', 'que es el juego de deletreo', 'deletreo'],
      r: 'En Deletreo ves el video de una seña y debes deletrear la palabra letra por letra, usando el alfabeto dactilológico, tal como se hace con nombres propios o palabras sin seña propia.' },
    { p: ['deletreo usa el abecedario', 'para jugar deletreo necesito saber el abecedario'],
      r: 'Sí, Deletreo se apoya directamente en el alfabeto dactilológico: por eso es una buena idea repasar primero la sección Abecedario.' },
    { p: ['cuantas vidas tengo en deletreo', 'que pasa si me equivoco en deletreo'],
      r: 'En Deletreo tienes 3 vidas. Si eliges una letra que no está en la palabra, pierdes una vida. Si se te acaban las 3 vidas o el reto de 8 palabras, se revela la palabra completa y pasas a la siguiente.' },
    { p: ['que es la pista en deletreo', 'cuanto cuesta la pista', 'como uso la pista en deletreo'],
      r: 'En Deletreo puedes usar el botón de Pista para que se llene automáticamente la siguiente letra que falta, pero te cuesta 15 puntos.' },
    { p: ['cuantas palabras tiene deletreo', 'cuantas rondas tiene deletreo'],
      r: 'El reto de Deletreo tiene 8 palabras por partida. El tiempo para cada una depende de qué tan larga sea la palabra.' },
    { p: ['que es la racha en deletreo', 'como sumo combo en deletreo'],
      r: 'En Deletreo, completar palabras seguidas sin fallar aumenta tu racha y multiplica los puntos que ganas por cada palabra correcta, igual que el combo en Contrarreloj.' },

    /* ---- 8. Cuenta / autenticación ---- */
    { p: ['como creo una cuenta', 'como me registro', 'como me creo un usuario', 'registro', 'cuenta', 'crear cuenta'],
      r: 'Ve a "Cuenta" en el menú y elige "Crear cuenta". Completa tus datos (o entra con Google) y listo: podrás guardar tu progreso, tu racha y tus logros.' },
    { p: ['puedo entrar con google', 'inicio de sesion con google', 'login con google'],
      r: 'Sí, en "Cuenta" puedes iniciar sesión con tu correo y contraseña o directamente con tu cuenta de Google.' },
    { p: ['como inicio sesion', 'como hago login', 'donde inicio sesion', 'login', 'iniciar sesion'],
      r: 'Ve a "Cuenta" en el menú principal y usa el formulario de inicio de sesión con tu correo y contraseña, o el botón de Google.' },
    { p: ['olvide mi contrasena', 'como recupero mi contrasena', 'no recuerdo mi clave'],
      r: 'En la pantalla de inicio de sesión hay una opción de "Recuperar contraseña" donde puedes restablecerla con tu correo registrado.' },
    { p: ['como cierro sesion', 'como salgo de mi cuenta', 'como hago logout'],
      r: 'Desde la sección "Cuenta" encuentras la opción para cerrar sesión.' },
    { p: ['es obligatorio crear una cuenta', 'puedo usar HANDNOVA sin cuenta'],
      r: 'No es obligatorio. Puedes ver categorías, el abecedario, usar el buscador y jugar sin cuenta. Solo la necesitas para guardar tu progreso, racha y logros de forma permanente en la nube.' },
    { p: ['puedo cambiar mis datos de cuenta', 'como edito mi perfil'],
      r: 'En la sección "Cuenta" puedes gestionar la información de tu perfil una vez hayas iniciado sesión.' },

    /* ---- 9. Progreso, racha, XP y logros ---- */
    { p: ['como veo mi progreso', 'donde esta mi progreso', 'progreso'],
      r: 'Ve al menú "Más" y toca "Progreso". Ahí ves tu nivel y XP, tu racha, tus logros y tu historial reciente.' },
    { p: ['que es la racha', 'como funciona la racha', 'como sumo dias de racha', 'racha'],
      r: 'La racha cuenta los días seguidos en los que terminas al menos un quiz o un juego (no solo con visitar la página). Se muestra en la barra de navegación.' },
    { p: ['que es el xp', 'que es el nivel', 'como subo de nivel', 'como se calcula el xp'],
      r: 'El XP se calcula sumando: 15 puntos por cada quiz jugado, 20 por cada partida de juego (Parejas o Contrarreloj), 15 por cada partida de Deletreo, 10 por cada categoría distinta que visitaste, 5 por cada día de racha, y 10 extra si ya usaste el buscador. Cada 150 XP subes un nivel.' },
    { p: ['que son los logros', 'donde veo mis logros', 'que logros hay', 'logros'],
      r: 'Los logros son insignias que desbloqueas al cumplir ciertos retos: crear tu cuenta, jugar tu primer quiz, sacar un puntaje alto, usar el buscador, jugar varias partidas, visitar varias categorías, mantener una racha, o dominar el nivel Experto del Quiz. Los ves en la sección Progreso.' },
    { p: ['cuantos logros hay', 'cuantos logros puedo desbloquear'],
      r: 'Actualmente hay 13 logros disponibles en HANDNOVA, desde "Perfil creado" hasta "Nivel Experto dominado".' },
    { p: ['que logros hay disponibles', 'lista de logros', 'cuales son todos los logros'],
      r: 'Los 13 logros son: Perfil creado, Primer quiz, Puntaje perfecto, Usaste el buscador, 5 partidas, Explorador, Velocista, Combo x3, Deletreo LSC, Constante, Racha de 7 días, Maestro de señas y Nivel Experto dominado.' },
    { p: ['que es el logro perfil creado', 'como desbloqueo perfil creado'],
      r: 'El logro "Perfil creado" se desbloquea simplemente al crear tu cuenta en HANDNOVA.' },
    { p: ['que es el logro primer quiz', 'como desbloqueo primer quiz'],
      r: 'El logro "Primer quiz" se desbloquea al completar tu primer quiz, sin importar la dificultad.' },
    { p: ['que es el logro puntaje perfecto', 'como desbloqueo puntaje perfecto'],
      r: 'El logro "Puntaje perfecto" se desbloquea al sacar 90% o más de aciertos en un quiz.' },
    { p: ['que es el logro usaste el buscador', 'como desbloqueo el logro de buscador'],
      r: 'El logro "Usaste el buscador" se desbloquea la primera vez que buscas una seña en la sección Buscar.' },
    { p: ['que es el logro 5 partidas', 'como desbloqueo 5 partidas'],
      r: 'El logro "5 partidas" se desbloquea al jugar 5 partidas en total, sumando todos los juegos de la plataforma.' },
    { p: ['que es el logro explorador', 'como desbloqueo explorador'],
      r: 'El logro "Explorador" se desbloquea al visitar 5 categorías distintas de lecciones.' },
    { p: ['que es el logro velocista', 'como desbloqueo velocista'],
      r: 'El logro "Velocista" se desbloquea al jugar una ronda del juego Contrarreloj.' },
    { p: ['que es el logro combo x3', 'como desbloqueo combo x3'],
      r: 'El logro "Combo x3" se desbloquea al encadenar un combo x3 en Contrarreloj, es decir, 5 aciertos seguidos sin fallar.' },
    { p: ['que es el logro deletreo lsc', 'como desbloqueo deletreo lsc'],
      r: 'El logro "Deletreo LSC" se desbloquea al completar el reto de Deletreo.' },
    { p: ['que es el logro constante', 'como desbloqueo constante'],
      r: 'El logro "Constante" se desbloquea al mantener una racha de 3 días seguidos practicando en HANDNOVA.' },
    { p: ['que es el logro racha de 7 dias', 'como desbloqueo racha de 7 dias'],
      r: 'El logro "Racha de 7 días" se desbloquea al mantener 7 días seguidos practicando en HANDNOVA.' },
    { p: ['que es el logro maestro de senas', 'como desbloqueo maestro de senas'],
      r: 'El logro "Maestro de señas" se desbloquea al jugar 20 partidas en total, sumando todos los juegos de la plataforma.' },
    { p: ['que es el logro nivel experto dominado', 'como desbloqueo experto dominado'],
      r: 'El logro "Nivel Experto dominado" se desbloquea al aprobar 3 quizzes en la dificultad Experto del Quiz.' },
    { p: ['mi progreso se guarda si cambio de dispositivo', 'mi progreso se sincroniza entre dispositivos'],
      r: 'Si tienes cuenta e inicias sesión, tu racha, XP y logros se sincronizan a través de Firebase entre dispositivos. Si no inicias sesión, ese progreso queda solo en el navegador de ese dispositivo (localStorage).' },
    { p: ['como veo mi historial', 'donde esta mi historial reciente'],
      r: 'En la sección "Progreso" encuentras un bloque de "Historial reciente" con tus últimas actividades en HANDNOVA.' },

    /* ---- 10. Modo oscuro / accesibilidad ---- */
    { p: ['como activo el modo oscuro', 'donde esta el modo oscuro', 'como pongo la pagina en oscuro', 'modo oscuro'],
      r: 'El modo oscuro se activa desde las opciones de tu cuenta/perfil y se aplica automáticamente en toda la plataforma, incluyendo categorías, juegos y este mismo chat.' },
    { p: ['el modo oscuro se guarda', 'tengo que activar el modo oscuro cada vez'],
      r: 'No, una vez lo activas queda guardado en tu navegador y se mantiene al navegar entre páginas.' },

    /* ---- 11. Navegación general / soporte técnico ---- */
    { p: ['como vuelvo al inicio', 'donde esta el inicio'],
      r: 'Toca el logo "HANDNOVA" en la esquina superior izquierda, o la opción "Inicio" del menú, para volver a la página principal.' },
    { p: ['tengo un error', 'la pagina no carga', 'un video no funciona', 'encontre un bug'],
      r: 'Lamento el inconveniente. Intenta recargar la página; si el problema sigue, revisa tu conexión a internet. Este chat no puede corregir errores técnicos directamente, pero puedes escribirnos a contactohandnova@gmail.com para reportarlo.' },
    { p: ['que navegador funciona mejor', 'en que navegador se ve mejor HANDNOVA'],
      r: 'HANDNOVA funciona en cualquier navegador moderno: Chrome, Firefox, Edge o Safari, tanto en celular como en computador.' },
    { p: ['los videos se pueden ver en pantalla completa', 'como pongo el video en pantalla completa'],
      r: 'Sí, la mayoría de videos de señas tienen un control para verse en pantalla completa; solo tienes que tocar el ícono correspondiente sobre el video.' },
    { p: ['puedo pausar el video de una sena', 'puedo repetir el video de una sena'],
      r: 'Sí, los videos de señas tienen controles normales de reproducción: puedes pausarlos, repetirlos o adelantarlos las veces que quieras para practicar con calma.' },

    /* ---- 12. Servicios institucionales ---- */
    { p: ['que es la seccion servicios', 'para que sirve servicios', 'servicios institucionales', 'servicios'],
      r: 'La sección "Servicios" está pensada para colegios, fundaciones, alcaldías u otras entidades que quieran llevar HANDNOVA a su comunidad, con opciones de licencia y contenido a la medida.' },
    { p: ['que planes de licencia hay', 'que opciones de licencia ofrece HANDNOVA'],
      r: 'Hay tres opciones: Licencia Básica (acceso institucional), Licencia Institucional (incluye todo lo de la Básica más vocabulario o categorías propias) y Marca Blanca (incluye todo lo anterior con el logo y colores de tu entidad).' },
    { p: ['ofrecen panel para docentes', 'hay panel para profesores'],
      r: 'Sí, como parte de los servicios personalizados se puede desarrollar un panel para que un docente vea el avance de sus estudiantes dentro de HANDNOVA.' },
    { p: ['se puede integrar HANDNOVA con moodle', 'se integra con otras plataformas educativas'],
      r: 'Sí, uno de los servicios personalizados es la integración de HANDNOVA con Moodle u otro sistema que ya use tu institución.' },
    { p: ['como contacto para servicios institucionales', 'como pido informacion de licencias'],
      r: 'Puedes escribir a contactohandnova@gmail.com o por WhatsApp al 304 452 3661, contándonos qué necesita tu institución.' },

    /* ---- 13. Soporte, contacto y legal ---- */
    { p: ['como contacto a HANDNOVA', 'cual es el correo de contacto', 'como escribo soporte'],
      r: 'Puedes escribirnos a contactohandnova@gmail.com o por WhatsApp al 304 452 3661.' },
    { p: ['cual es el horario de atencion', 'a que hora responden'],
      r: 'El horario de atención es de lunes a viernes, de 8:00 a.m. a 5:00 p.m.' },
    { p: ['HANDNOVA maneja pagos por whatsapp', 'puedo pagar por whatsapp'],
      r: 'No, HANDNOVA no maneja cobros ni pagos por WhatsApp ni por ningún otro medio de contacto directo.' },
    { p: ['tienen redes sociales', 'tienen linkedin', 'tienen instagram'],
      r: 'Por ahora HANDNOVA está preparando su presencia en LinkedIn; aún no está activa, pero próximamente estará disponible.' },
    { p: ['donde estan los terminos y condiciones', 'que dicen los terminos y condiciones'],
      r: 'Puedes leer los Términos y Condiciones completos en el pie de página de HANDNOVA, en la sección "Legal".' },
    { p: ['como tratan mis datos personales', 'donde esta la politica de privacidad', 'tratamiento de datos'],
      r: 'HANDNOVA tiene una página de "Tratamiento de Datos" en el pie de página, donde se explica cómo se usa la información de tu cuenta.' },

    /* ---- 17. Señas individuales del catálogo (autogenerado desde senas_disponibles.json) ---- */
    { p: ['como se dice perro en senas', 'como se dice perro en lsc', 'sena de perro', 'como es la sena de perro'],
      r: 'La seña de "Perro" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "perro" en la sección Buscar.' },
    { p: ['como se dice gato en senas', 'como se dice gato en lsc', 'sena de gato', 'como es la sena de gato'],
      r: 'La seña de "Gato" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "gato" en la sección Buscar.' },
    { p: ['como se dice loro en senas', 'como se dice loro en lsc', 'sena de loro', 'como es la sena de loro'],
      r: 'La seña de "Loro" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "loro" en la sección Buscar.' },
    { p: ['como se dice vaca en senas', 'como se dice vaca en lsc', 'sena de vaca', 'como es la sena de vaca'],
      r: 'La seña de "Vaca" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "vaca" en la sección Buscar.' },
    { p: ['como se dice caballo en senas', 'como se dice caballo en lsc', 'sena de caballo', 'como es la sena de caballo'],
      r: 'La seña de "Caballo" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "caballo" en la sección Buscar.' },
    { p: ['como se dice tiburon en senas', 'como se dice tiburon en lsc', 'sena de tiburon', 'como es la sena de tiburon'],
      r: 'La seña de "Tiburón" está en la categoría Animales. Puedes verla ahí o buscarla directamente escribiendo "tiburon" en la sección Buscar.' },
    { p: ['como se dice rojo en senas', 'como se dice rojo en lsc', 'sena de rojo', 'como es la sena de rojo'],
      r: 'La seña de "Rojo" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "rojo" en la sección Buscar.' },
    { p: ['como se dice azul en senas', 'como se dice azul en lsc', 'sena de azul', 'como es la sena de azul'],
      r: 'La seña de "Azul" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "azul" en la sección Buscar.' },
    { p: ['como se dice amarillo en senas', 'como se dice amarillo en lsc', 'sena de amarillo', 'como es la sena de amarillo'],
      r: 'La seña de "Amarillo" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "amarillo" en la sección Buscar.' },
    { p: ['como se dice negro en senas', 'como se dice negro en lsc', 'sena de negro', 'como es la sena de negro'],
      r: 'La seña de "Negro" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "negro" en la sección Buscar.' },
    { p: ['como se dice blanco en senas', 'como se dice blanco en lsc', 'sena de blanco', 'como es la sena de blanco'],
      r: 'La seña de "Blanco" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "blanco" en la sección Buscar.' },
    { p: ['como se dice rosado en senas', 'como se dice rosado en lsc', 'sena de rosado', 'como es la sena de rosado'],
      r: 'La seña de "Rosado" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "rosado" en la sección Buscar.' },
    { p: ['como se dice naranja en senas', 'como se dice naranja en lsc', 'sena de naranja', 'como es la sena de naranja'],
      r: 'La seña de "Naranja" está en la categoría Colores. Puedes verla ahí o buscarla directamente escribiendo "naranja" en la sección Buscar.' },
    { p: ['como se dice almuerzo en senas', 'como se dice almuerzo en lsc', 'sena de almuerzo', 'como es la sena de almuerzo'],
      r: 'La seña de "Almuerzo" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "almuerzo" en la sección Buscar.' },
    { p: ['como se dice caliente en senas', 'como se dice caliente en lsc', 'sena de caliente', 'como es la sena de caliente'],
      r: 'La seña de "Caliente" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "caliente" en la sección Buscar.' },
    { p: ['como se dice cena en senas', 'como se dice cena en lsc', 'sena de cena', 'como es la sena de cena'],
      r: 'La seña de "Cena" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "cena" en la sección Buscar.' },
    { p: ['como se dice desayunar en senas', 'como se dice desayunar en lsc', 'sena de desayunar', 'como es la sena de desayunar'],
      r: 'La seña de "Desayunar" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "desayunar" en la sección Buscar.' },
    { p: ['como se dice hambre en senas', 'como se dice hambre en lsc', 'sena de hambre', 'como es la sena de hambre'],
      r: 'La seña de "Hambre" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "hambre" en la sección Buscar.' },
    { p: ['como se dice sopa en senas', 'como se dice sopa en lsc', 'sena de sopa', 'como es la sena de sopa'],
      r: 'La seña de "Sopa" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "sopa" en la sección Buscar.' },
    { p: ['como se dice pescado en senas', 'como se dice pescado en lsc', 'sena de pescado', 'como es la sena de pescado'],
      r: 'La seña de "Pescado" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "pescado" en la sección Buscar.' },
    { p: ['como se dice pollo en senas', 'como se dice pollo en lsc', 'sena de pollo', 'como es la sena de pollo'],
      r: 'La seña de "Pollo" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "pollo" en la sección Buscar.' },
    { p: ['como se dice carne en senas', 'como se dice carne en lsc', 'sena de carne', 'como es la sena de carne'],
      r: 'La seña de "Carne" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "carne" en la sección Buscar.' },
    { p: ['como se dice arroz en senas', 'como se dice arroz en lsc', 'sena de arroz', 'como es la sena de arroz'],
      r: 'La seña de "Arroz" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "arroz" en la sección Buscar.' },
    { p: ['como se dice pasta en senas', 'como se dice pasta en lsc', 'sena de pasta', 'como es la sena de pasta'],
      r: 'La seña de "Pasta" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "pasta" en la sección Buscar.' },
    { p: ['como se dice cabeza en senas', 'como se dice cabeza en lsc', 'sena de cabeza', 'como es la sena de cabeza'],
      r: 'La seña de "Cabeza" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "cabeza" en la sección Buscar.' },
    { p: ['como se dice brazos en senas', 'como se dice brazos en lsc', 'sena de brazos', 'como es la sena de brazos'],
      r: 'La seña de "Brazos" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "brazos" en la sección Buscar.' },
    { p: ['como se dice pies en senas', 'como se dice pies en lsc', 'sena de pies', 'como es la sena de pies'],
      r: 'La seña de "Pies" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "pies" en la sección Buscar.' },
    { p: ['como se dice manos en senas', 'como se dice manos en lsc', 'sena de manos', 'como es la sena de manos'],
      r: 'La seña de "Manos" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "manos" en la sección Buscar.' },
    { p: ['como se dice boca en senas', 'como se dice boca en lsc', 'sena de boca', 'como es la sena de boca'],
      r: 'La seña de "Boca" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "boca" en la sección Buscar.' },
    { p: ['como se dice ojo en senas', 'como se dice ojo en lsc', 'sena de ojo', 'como es la sena de ojo'],
      r: 'La seña de "Ojo" está en la categoría Cuerpo humano. Puedes verla ahí o buscarla directamente escribiendo "ojo" en la sección Buscar.' },
    { p: ['como se dice amor en senas', 'como se dice amor en lsc', 'sena de amor', 'como es la sena de amor'],
      r: 'La seña de "Amor" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "amor" en la sección Buscar.' },
    { p: ['como se dice feliz en senas', 'como se dice feliz en lsc', 'sena de feliz', 'como es la sena de feliz'],
      r: 'La seña de "Feliz" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "feliz" en la sección Buscar.' },
    { p: ['como se dice desagrado en senas', 'como se dice desagrado en lsc', 'sena de desagrado', 'como es la sena de desagrado'],
      r: 'La seña de "Desagrado" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "desagrado" en la sección Buscar.' },
    { p: ['como se dice ira en senas', 'como se dice ira en lsc', 'sena de ira', 'como es la sena de ira'],
      r: 'La seña de "Ira" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "ira" en la sección Buscar.' },
    { p: ['como se dice sorpresa en senas', 'como se dice sorpresa en lsc', 'sena de sorpresa', 'como es la sena de sorpresa'],
      r: 'La seña de "Sorpresa" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "sorpresa" en la sección Buscar.' },
    { p: ['como se dice triste en senas', 'como se dice triste en lsc', 'sena de triste', 'como es la sena de triste'],
      r: 'La seña de "Triste" está en la categoría Emociones. Puedes verla ahí o buscarla directamente escribiendo "triste" en la sección Buscar.' },
    { p: ['como se dice cuaderno en senas', 'como se dice cuaderno en lsc', 'sena de cuaderno', 'como es la sena de cuaderno'],
      r: 'La seña de "Cuaderno" está en la categoría Escuela. Puedes verla ahí o buscarla directamente escribiendo "cuaderno" en la sección Buscar.' },
    { p: ['como se dice colegio en senas', 'como se dice colegio en lsc', 'sena de colegio', 'como es la sena de colegio'],
      r: 'La seña de "Colegio" está en la categoría Escuela. Puedes verla ahí o buscarla directamente escribiendo "colegio" en la sección Buscar.' },
    { p: ['como se dice colores escolares en senas', 'como se dice colores escolares en lsc', 'sena de colores escolares', 'como es la sena de colores escolares'],
      r: 'La seña de "Colores" está en la categoría Escuela. Puedes verla ahí o buscarla directamente escribiendo "colores" en la sección Buscar.' },
    { p: ['como se dice esfero en senas', 'como se dice esfero en lsc', 'sena de esfero', 'como es la sena de esfero'],
      r: 'La seña de "Esfero" está en la categoría Escuela. Puedes verla ahí o buscarla directamente escribiendo "esfero" en la sección Buscar.' },
    { p: ['como se dice maleta en senas', 'como se dice maleta en lsc', 'sena de maleta', 'como es la sena de maleta'],
      r: 'La seña de "Maleta" está en la categoría Escuela. Puedes verla ahí o buscarla directamente escribiendo "maleta" en la sección Buscar.' },
    { p: ['como se dice abuelo en senas', 'como se dice abuelo en lsc', 'sena de abuelo', 'como es la sena de abuelo'],
      r: 'La seña de "Abuelo" está en la categoría Familia. Puedes verla ahí o buscarla directamente escribiendo "abuelo" en la sección Buscar.' },
    { p: ['como se dice mama en senas', 'como se dice mama en lsc', 'sena de mama', 'como es la sena de mama'],
      r: 'La seña de "Mamá" está en la categoría Familia. Puedes verla ahí o buscarla directamente escribiendo "mama" en la sección Buscar.' },
    { p: ['como se dice papa en senas', 'como se dice papa en lsc', 'sena de papa', 'como es la sena de papa'],
      r: 'La seña de "Papá" está en la categoría Familia. Puedes verla ahí o buscarla directamente escribiendo "papa" en la sección Buscar.' },
    { p: ['como se dice hijo en senas', 'como se dice hijo en lsc', 'sena de hijo', 'como es la sena de hijo'],
      r: 'La seña de "Hijo" está en la categoría Familia. Puedes verla ahí o buscarla directamente escribiendo "hijo" en la sección Buscar.' },
    { p: ['como se dice familia en senas', 'como se dice familia en lsc', 'sena de familia', 'como es la sena de familia'],
      r: 'La seña de "Familia" está en la categoría Familia. Puedes verla ahí o buscarla directamente escribiendo "familia" en la sección Buscar.' },
    { p: ['como se dice profesor en senas', 'como se dice profesor en lsc', 'sena de profesor', 'como es la sena de profesor'],
      r: 'La seña de "Profesor" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "profesor" en la sección Buscar.' },
    { p: ['como se dice cantante en senas', 'como se dice cantante en lsc', 'sena de cantante', 'como es la sena de cantante'],
      r: 'La seña de "Cantante" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "cantante" en la sección Buscar.' },
    { p: ['como se dice enfermera en senas', 'como se dice enfermera en lsc', 'sena de enfermera', 'como es la sena de enfermera'],
      r: 'La seña de "Enfermera" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "enfermera" en la sección Buscar.' },
    { p: ['como se dice ingeniero en senas', 'como se dice ingeniero en lsc', 'sena de ingeniero', 'como es la sena de ingeniero'],
      r: 'La seña de "Ingeniero" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "ingeniero" en la sección Buscar.' },
    { p: ['como se dice policia en senas', 'como se dice policia en lsc', 'sena de policia', 'como es la sena de policia'],
      r: 'La seña de "Policía" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "policia" en la sección Buscar.' },
    { p: ['como se dice psicologo en senas', 'como se dice psicologo en lsc', 'sena de psicologo', 'como es la sena de psicologo'],
      r: 'La seña de "Psicólogo" está en la categoría Profesiones. Puedes verla ahí o buscarla directamente escribiendo "psicologo" en la sección Buscar.' },
    { p: ['como se dice hola en senas', 'como se dice hola en lsc', 'sena de hola', 'como es la sena de hola'],
      r: 'La seña de "Hola" está en la categoría Saludos. Puedes verla ahí o buscarla directamente escribiendo "hola" en la sección Buscar.' },
    { p: ['como se dice buenos dias en senas', 'como se dice buenos dias en lsc', 'sena de buenos dias', 'como es la sena de buenos dias'],
      r: 'La seña de "Buenos días" está en la categoría Saludos. Puedes verla ahí o buscarla directamente escribiendo "buenos_dias" en la sección Buscar.' },
    { p: ['como se dice buenas tardes en senas', 'como se dice buenas tardes en lsc', 'sena de buenas tardes', 'como es la sena de buenas tardes'],
      r: 'La seña de "Buenas tardes" está en la categoría Saludos. Puedes verla ahí o buscarla directamente escribiendo "buenas_tardes" en la sección Buscar.' },
    { p: ['como se dice buenas noches en senas', 'como se dice buenas noches en lsc', 'sena de buenas noches', 'como es la sena de buenas noches'],
      r: 'La seña de "Buenas noches" está en la categoría Saludos. Puedes verla ahí o buscarla directamente escribiendo "buenas_noches" en la sección Buscar.' },
    { p: ['como se dice como estas en senas', 'como se dice como estas en lsc', 'sena de como estas', 'como es la sena de como estas'],
      r: 'La seña de "¿Cómo estás?" está en la categoría Saludos. Puedes verla ahí o buscarla directamente escribiendo "como_estas" en la sección Buscar.' },
    { p: ['como se dice casa en senas', 'como se dice casa en lsc', 'sena de casa', 'como es la sena de casa'],
      r: 'La seña de "Casa" está en la categoría Vida Diaria. Puedes verla ahí o buscarla directamente escribiendo "casa" en la sección Buscar.' },
    { p: ['como se dice dormir en senas', 'como se dice dormir en lsc', 'sena de dormir', 'como es la sena de dormir'],
      r: 'La seña de "Dormir" está en la categoría Vida Diaria. Puedes verla ahí o buscarla directamente escribiendo "dormir" en la sección Buscar.' },
    { p: ['como se dice trabajar en senas', 'como se dice trabajar en lsc', 'sena de trabajar', 'como es la sena de trabajar'],
      r: 'La seña de "Trabajar" está en la categoría Vida Diaria. Puedes verla ahí o buscarla directamente escribiendo "trabajar" en la sección Buscar.' },
    { p: ['como se dice caminar en senas', 'como se dice caminar en lsc', 'sena de caminar', 'como es la sena de caminar'],
      r: 'La seña de "Caminar" está en la categoría Vida Diaria. Puedes verla ahí o buscarla directamente escribiendo "caminar" en la sección Buscar.' },
    { p: ['como se dice tiempo en senas', 'como se dice tiempo en lsc', 'sena de tiempo', 'como es la sena de tiempo'],
      r: 'La seña de "Tiempo" está en la categoría Vida Diaria. Puedes verla ahí o buscarla directamente escribiendo "tiempo" en la sección Buscar.' },
    { p: ['como se dice futbol en senas', 'como se dice futbol en lsc', 'sena de futbol', 'como es la sena de futbol'],
      r: 'La seña de "Fútbol" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "futbol" en la sección Buscar.' },
    { p: ['como se dice baloncesto en senas', 'como se dice baloncesto en lsc', 'sena de baloncesto', 'como es la sena de baloncesto'],
      r: 'La seña de "Baloncesto" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "baloncesto" en la sección Buscar.' },
    { p: ['como se dice beisbol en senas', 'como se dice beisbol en lsc', 'sena de beisbol', 'como es la sena de beisbol'],
      r: 'La seña de "Béisbol" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "beisbol" en la sección Buscar.' },
    { p: ['como se dice boxeo en senas', 'como se dice boxeo en lsc', 'sena de boxeo', 'como es la sena de boxeo'],
      r: 'La seña de "Boxeo" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "boxeo" en la sección Buscar.' },
    { p: ['como se dice fiebre en senas', 'como se dice fiebre en lsc', 'sena de fiebre', 'como es la sena de fiebre'],
      r: 'La seña de "Fiebre" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "fiebre" en la sección Buscar.' },
    { p: ['como se dice frio en senas', 'como se dice frio en lsc', 'sena de frio', 'como es la sena de frio'],
      r: 'La seña de "Frío" está en la categoría Comida. Puedes verla ahí o buscarla directamente escribiendo "frio" en la sección Buscar.' },
    { p: ['como se dice tenis en senas', 'como se dice tenis en lsc', 'sena de tenis', 'como es la sena de tenis'],
      r: 'La seña de "Tenis" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "tenis" en la sección Buscar.' },
    { p: ['como se dice vela de deporte en senas', 'como se dice vela de deporte en lsc', 'sena de vela de deporte', 'como es la sena de vela de deporte'],
      r: 'La seña de "Vela (deporte)" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "vela" en la sección Buscar.' },
    { p: ['como se dice futbol americano en senas', 'como se dice futbol americano en lsc', 'sena de futbol americano', 'como es la sena de futbol americano'],
      r: 'La seña de "Fútbol americano" está en la categoría Deportes. Puedes verla ahí o buscarla directamente escribiendo "futbol_americano" en la sección Buscar.' },
    { p: ['como se dice asma en senas', 'como se dice asma en lsc', 'sena de asma', 'como es la sena de asma'],
      r: 'La seña de "Asma" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "asma" en la sección Buscar.' },
    { p: ['como se dice cancer en senas', 'como se dice cancer en lsc', 'sena de cancer', 'como es la sena de cancer'],
      r: 'La seña de "Cáncer" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "cancer" en la sección Buscar.' },
    { p: ['como se dice gripa en senas', 'como se dice gripa en lsc', 'sena de gripa', 'como es la sena de gripa'],
      r: 'La seña de "Gripa" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "gripa" en la sección Buscar.' },
    { p: ['como se dice mareo en senas', 'como se dice mareo en lsc', 'sena de mareo', 'como es la sena de mareo'],
      r: 'La seña de "Mareo" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "mareo" en la sección Buscar.' },
    { p: ['como se dice pastillas en senas', 'como se dice pastillas en lsc', 'sena de pastillas', 'como es la sena de pastillas'],
      r: 'La seña de "Pastillas" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "pastillas" en la sección Buscar.' },
    { p: ['como se dice cirugia en senas', 'como se dice cirugia en lsc', 'sena de cirugia', 'como es la sena de cirugia'],
      r: 'La seña de "Cirugía" está en la categoría Salud. Puedes verla ahí o buscarla directamente escribiendo "cirugia" en la sección Buscar.' },
  ];

  /* Sugerencias rápidas que se muestran al abrir el chat por primera vez */
  const SUGERENCIAS = [
    '¿Qué es la LSC?',
    '¿Qué hay en Categorías?',
    '¿Cómo juego el Quiz?',
    '¿Cómo busco una seña?',
    '¿Qué son los logros?'
  ];

  const RESPUESTAS_DEFECTO = [
    'No entendí muy bien tu pregunta 🤔 ¿Puedes reformularla con otras palabras? Por ejemplo, pregúntame "¿qué hay en la categoría animales?" o "¿cómo funciona el quiz?".',
    'Todavía no tengo una respuesta para eso. Prueba con temas como: categorías, abecedario, buscar, juegos, cuenta, progreso o logros.',
    'Hmm, no logré identificar tu pregunta. Intenta ser más específico, por ejemplo: "¿cómo creo una cuenta?" o "¿qué es el abecedario?".'
  ];

  /* ------------------------------------------------------------------ *
   * 2. UTILIDADES DE TEXTO Y BÚSQUEDA
   * ------------------------------------------------------------------ */
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[¿?¡!.,;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function encontrarRespuesta(pregunta) {
    const texto = normalizar(pregunta);
    let mejor = null;
    let mejorPuntaje = 0;
    for (let i = 0; i < BASE.length; i++) {
      const entrada = BASE[i];
      for (let j = 0; j < entrada.p.length; j++) {
        const patron = normalizar(entrada.p[j]);
        if (patron && texto.indexOf(patron) !== -1 && patron.length > mejorPuntaje) {
          mejorPuntaje = patron.length;
          mejor = entrada;
        }
      }
    }
    if (mejor) return mejor.r;
    return RESPUESTAS_DEFECTO[Math.floor(Math.random() * RESPUESTAS_DEFECTO.length)];
  }

  /* ------------------------------------------------------------------ *
   * 3. PERSISTENCIA DEL HISTORIAL (localStorage, compartido entre páginas)
   * ------------------------------------------------------------------ */
  const CLAVE_HISTORIAL = 'HANDNOVA_chat_historial';
  const MAX_MENSAJES = 60;

  function cargarHistorial() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || '[]');
    } catch (e) {
      return [];
    }
  }

  function guardarHistorial(historial) {
    const recortado = historial.slice(-MAX_MENSAJES);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(recortado));
  }

  /* ------------------------------------------------------------------ *
   * 4. ESTILOS (inyectados una sola vez)
   * ------------------------------------------------------------------ */
  function inyectarEstilos() {
    if (document.getElementById('HANDNOVA-chatbot-estilos')) return;
    const estilo = document.createElement('style');
    estilo.id = 'HANDNOVA-chatbot-estilos';
    estilo.textContent = `
      .sv-cb-burbuja {
        position: fixed; bottom: 22px; right: 22px; width: 58px; height: 58px;
        border-radius: 50%; border: none; cursor: pointer; z-index: 9999;
        background: linear-gradient(135deg, var(--magenta, #e040fb), var(--morado, #7c3aed), var(--cyan, #00bcd4));
        box-shadow: var(--sombra-lg, 0 20px 50px rgba(30,20,60,0.25));
        display: flex; align-items: center; justify-content: center;
        transition: transform .2s ease;
      }
      .sv-cb-burbuja:hover { transform: scale(1.07); }
      .sv-cb-burbuja svg { width: 26px; height: 26px; color: white; }
      .sv-cb-burbuja .sv-cb-badge {
        position: absolute; top: -2px; right: -2px; background: #ef4444; color: white;
        font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      }

      .sv-cb-panel {
        position: fixed; bottom: 92px; right: 22px; width: 350px; max-width: 92vw;
        height: 500px; max-height: 74vh; background: #ffffff; border-radius: var(--radio-lg, 22px);
        box-shadow: var(--sombra-lg, 0 20px 50px rgba(30,20,60,0.25)); z-index: 9999;
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; transform: translateY(16px) scale(.97); pointer-events: none;
        transition: opacity .18s ease, transform .18s ease;
        font-family: var(--font-cuerpo, 'Poppins', sans-serif);
      }
      .sv-cb-panel.sv-cb-abierto { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

      .sv-cb-header {
        background: linear-gradient(to right, var(--magenta, #e040fb), #a855f7, var(--cyan, #00bcd4));
        color: white; padding: 14px 16px; display: flex; align-items: center; gap: 10px;
        flex-shrink: 0;
      }
      .sv-cb-header-avatar {
        width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,.22);
        display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
      }
      .sv-cb-header-texto { flex: 1; min-width: 0; }
      .sv-cb-header-texto strong { display: block; font-size: 14px; font-family: var(--font-titulos, 'Outfit', sans-serif); }
      .sv-cb-header-texto span { display: block; font-size: 11px; opacity: .85; }
      .sv-cb-cerrar {
        background: none; border: none; color: white; opacity: .85; cursor: pointer;
        width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
        border-radius: 50%; flex-shrink: 0;
      }
      .sv-cb-cerrar:hover { opacity: 1; background: rgba(255,255,255,.15); }

      .sv-cb-mensajes {
        flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;
        background: var(--azul-fondo, #dff0f5); background: #f7f8fb;
      }
      .sv-cb-msg { max-width: 82%; padding: 9px 12px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; }
      .sv-cb-msg-bot { align-self: flex-start; background: white; color: var(--negro, #1a1a1a); border-bottom-left-radius: 4px; box-shadow: var(--sombra-sm, 0 2px 10px rgba(30,20,60,.06)); }
      .sv-cb-msg-user { align-self: flex-end; background: linear-gradient(135deg, var(--morado, #7c3aed), var(--cyan, #00bcd4)); color: white; border-bottom-right-radius: 4px; }

      .sv-cb-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 12px; flex-shrink: 0; }
      .sv-cb-chip {
        border: 1px solid rgba(124,58,237,.28); background: white; color: var(--morado, #7c3aed);
        font-size: 11.5px; font-weight: 600; padding: 6px 10px; border-radius: 30px; cursor: pointer;
        transition: background .15s ease;
      }
      .sv-cb-chip:hover { background: rgba(124,58,237,.08); }

      .sv-cb-form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #eee; flex-shrink: 0; background: white; }
      .sv-cb-input {
        flex: 1; border: 1px solid #e2e2e2; border-radius: 20px; padding: 9px 14px; font-size: 13px;
        font-family: inherit; outline: none;
      }
      .sv-cb-input:focus { border-color: var(--morado, #7c3aed); }
      .sv-cb-enviar {
        width: 36px; height: 36px; border-radius: 50%; border: none; flex-shrink: 0; cursor: pointer;
        background: linear-gradient(135deg, var(--morado, #7c3aed), var(--cyan, #00bcd4)); color: white;
        display: flex; align-items: center; justify-content: center;
      }
      .sv-cb-enviar:disabled { opacity: .5; cursor: default; }
      .sv-cb-enviar svg { width: 16px; height: 16px; }

      @media (max-width: 420px) {
        .sv-cb-panel { right: 4vw; left: 4vw; width: auto; bottom: 88px; }
        .sv-cb-burbuja { right: 16px; bottom: 16px; }
      }

      /* ---- Modo oscuro (misma convención que el resto de HANDNOVA) ---- */
      body.modo-oscuro .sv-cb-panel { background: #1a1d27; }
      body.modo-oscuro .sv-cb-mensajes { background: #12141c; }
      body.modo-oscuro .sv-cb-msg-bot { background: #232733; color: #e5e7eb; }
      body.modo-oscuro .sv-cb-chip { background: #232733; border-color: #333846; color: #c4b5fd; }
      body.modo-oscuro .sv-cb-chip:hover { background: #2a2e3b; }
      body.modo-oscuro .sv-cb-form { background: #1a1d27; border-top-color: #2a2e3b; }
      body.modo-oscuro .sv-cb-input { background: #232733; border-color: #333846; color: #e5e7eb; }
    `;
    document.head.appendChild(estilo);
  }

  /* ------------------------------------------------------------------ *
   * 5. CONSTRUCCIÓN DEL WIDGET
   * ------------------------------------------------------------------ */
  function crearWidget() {
    inyectarEstilos();

    // Burbuja flotante
    const burbuja = document.createElement('button');
    burbuja.className = 'sv-cb-burbuja';
    burbuja.type = 'button';
    burbuja.title = 'Asistente HANDNOVA';
    burbuja.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>';

    // Panel
    const panel = document.createElement('div');
    panel.className = 'sv-cb-panel';
    panel.innerHTML = `
      <div class="sv-cb-header">
        <div class="sv-cb-header-avatar">🤖</div>
        <div class="sv-cb-header-texto">
          <strong>Asistente HANDNOVA</strong>
        </div>
        <button type="button" class="sv-cb-cerrar" title="Cerrar" id="sv-cb-cerrar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="sv-cb-mensajes" id="sv-cb-mensajes"></div>
      <div class="sv-cb-chips" id="sv-cb-chips"></div>
      <form class="sv-cb-form" id="sv-cb-form">
        <input class="sv-cb-input" id="sv-cb-input" type="text" autocomplete="off" placeholder="Escribe tu pregunta..." maxlength="200">
        <button class="sv-cb-enviar" type="submit" id="sv-cb-enviar" title="Enviar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;

    document.body.appendChild(burbuja);
    document.body.appendChild(panel);

    const zonaMensajes = panel.querySelector('#sv-cb-mensajes');
    const zonaChips = panel.querySelector('#sv-cb-chips');
    const form = panel.querySelector('#sv-cb-form');
    const input = panel.querySelector('#sv-cb-input');
    const btnCerrar = panel.querySelector('#sv-cb-cerrar');

    let historial = cargarHistorial();

    function pintarMensaje(rol, texto) {
      const burbujaMsg = document.createElement('div');
      burbujaMsg.className = 'sv-cb-msg ' + (rol === 'user' ? 'sv-cb-msg-user' : 'sv-cb-msg-bot');
      burbujaMsg.textContent = texto;
      zonaMensajes.appendChild(burbujaMsg);
      zonaMensajes.scrollTop = zonaMensajes.scrollHeight;
    }

    function pintarChips() {
      zonaChips.innerHTML = '';
      SUGERENCIAS.forEach(function (sugerencia) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'sv-cb-chip';
        chip.textContent = sugerencia;
        chip.addEventListener('click', function () { enviarPregunta(sugerencia); });
        zonaChips.appendChild(chip);
      });
    }

    function renderizarTodo() {
      zonaMensajes.innerHTML = '';
      if (historial.length === 0) {
        const bienvenida = '¡Hola! 👋 Soy el asistente de HANDNOVA. Pregúntame sobre la LSC, las categorías, los juegos, tu cuenta o tu progreso.';
        pintarMensaje('bot', bienvenida);
        historial.push({ rol: 'bot', texto: bienvenida });
        guardarHistorial(historial);
      } else {
        historial.forEach(function (m) { pintarMensaje(m.rol, m.texto); });
      }
      const yaPregunto = historial.some(function (m) { return m.rol === 'user'; });
      if (!yaPregunto) pintarChips();
    }

    function enviarPregunta(texto) {
      const limpio = texto.trim();
      if (!limpio) return;
      zonaChips.innerHTML = '';
      pintarMensaje('user', limpio);
      historial.push({ rol: 'user', texto: limpio });

      const respuesta = encontrarRespuesta(limpio);
      // pequeño retardo para que se sienta como una respuesta, no un salto brusco
      setTimeout(function () {
        pintarMensaje('bot', respuesta);
        historial.push({ rol: 'bot', texto: respuesta });
        guardarHistorial(historial);
      }, 260);

      guardarHistorial(historial);
      input.value = '';
      input.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      enviarPregunta(input.value);
    });

    function abrirPanel() {
      panel.classList.add('sv-cb-abierto');
      input.focus();
    }
    function cerrarPanel() {
      panel.classList.remove('sv-cb-abierto');
    }

    burbuja.addEventListener('click', function () {
      if (panel.classList.contains('sv-cb-abierto')) { cerrarPanel(); } else { abrirPanel(); }
    });
    btnCerrar.addEventListener('click', cerrarPanel);

    renderizarTodo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearWidget);
  } else {
    crearWidget();
  }
})();