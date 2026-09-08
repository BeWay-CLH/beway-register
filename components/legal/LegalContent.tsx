import type { ReactNode } from "react";
import {
  TERMS_VERSION,
  PRIVACY_NOTICE_VERSION,
  AVISO_LEGAL_VERSION,
  COOKIES_POLICY_VERSION,
  PRIVACY_CONTACT_EMAIL,
  GENERAL_CONTACT_EMAIL,
} from "@/lib/legal/constants";

// Contenido legal completo (BEWAY | Pre-Registro · Cambios UX + legal, v3.0
// · Parte B). Son borradores operativos, no textos certificados — todos los
// campos entre corchetes ([RAZÓN SOCIAL], [NIF], [DOMICILIO], [FECHA]...)
// quedan visibles a propósito hasta que Legal/Negocio los cierre (ver
// docs/pending-decisions.md #2 y #9). No reemplazar por datos inventados.
//
// Estos mismos componentes se usan en dos sitios: la página completa
// (app/(marketing)/terminos, /privacidad, ...) y el modal del formulario de
// registro (components/forms/LegalDocumentModal) — un solo texto, sin
// duplicar.

export function VersionNote({ version }: { version: string }) {
  return <p className="font-body text-[12px] text-text-muted">Versión {version} · [FECHA]</p>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 font-heading text-h3 text-text-heading first:mt-0">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 font-body text-body leading-relaxed text-text-muted">{children}</p>;
}

export function TerminosContent() {
  return (
    <div>
      <VersionNote version={TERMS_VERSION} />

      <H2>1. Identificación</H2>
      <P>
        Estos Términos regulan el acceso y uso del Pre-Registro de BeWay, operado por [RAZÓN SOCIAL COMPLETA], con
        NIF [NIF], domicilio en [DOMICILIO] y correo de contacto {GENERAL_CONTACT_EMAIL}.
      </P>

      <H2>2. Qué es el Pre-Registro</H2>
      <P>
        El Pre-Registro permite crear una cuenta, preparar y conservar un CV Vivo y acceder anticipadamente a
        determinadas funcionalidades de BeWay antes del lanzamiento de la plataforma definitiva. Es una versión
        previa al lanzamiento, por lo que determinadas funcionalidades, nombres, características o integraciones
        pueden cambiar.
      </P>

      <H2>3. Requisitos de uso</H2>
      <P>
        Debes proporcionar información razonablemente veraz y actualizada y utilizar el servicio conforme a estos
        Términos y a la legislación aplicable.
      </P>

      <H2>4. Cuenta y seguridad</H2>
      <P>
        Eres responsable de mantener la confidencialidad de tus credenciales y de adoptar medidas razonables para
        proteger el acceso a tu cuenta. Si detectas un acceso no autorizado o sospechas que tus credenciales se han
        visto comprometidas, utiliza los mecanismos de recuperación disponibles o contacta con BeWay.
      </P>

      <H2>5. Tu CV Vivo y tus contenidos</H2>
      <P>
        Conservas la titularidad sobre la información y los contenidos que incorporas a tu CV Vivo. Para poder
        prestar el servicio, autorizas a BeWay, de forma no exclusiva y limitada, a alojar, reproducir técnicamente,
        transformar en los formatos necesarios y procesar esos contenidos únicamente en la medida necesaria para
        ofrecer las funcionalidades que solicites. Esta autorización no permite a BeWay explotar de forma general tus
        contenidos para fines ajenos al servicio ni utilizar tu CV de forma general para entrenar modelos de
        inteligencia artificial sin una revisión y base jurídica específicas.
      </P>

      <H2>6. Visibilidad del perfil</H2>
      <P>
        Crear una cuenta no publica automáticamente tu CV Vivo. Tu perfil comienza privado. Cuando BeWay habilite
        funciones de conexión con empresas, podrás configurar las opciones disponibles y decidir si quieres hacer
        visible tu CV a empresas verificadas del ecosistema.
      </P>

      <H2>7. Migración a la plataforma definitiva</H2>
      <P>
        Cuando BeWay lance su plataforma definitiva, la cuenta y la información del CV Vivo podrán trasladarse
        técnicamente al nuevo entorno para dar continuidad al servicio. La migración no cambiará por sí sola tu
        configuración de privacidad, no hará visible automáticamente tu perfil y no activará nuevos consentimientos.
        Cuando corresponda, se te mostrarán los Términos definitivos y la Política de Privacidad actualizada.
      </P>

      <H2>8. Comunicaciones</H2>
      <P>
        BeWay podrá enviarte comunicaciones necesarias para crear, mantener, asegurar o gestionar tu cuenta, como
        verificaciones, recuperación de contraseña, avisos de seguridad o información necesaria sobre el lanzamiento
        y la continuidad del servicio. Las comunicaciones comerciales o promocionales solo se enviarán cuando exista
        una base jurídica que lo permita. Cuando se basen en tu consentimiento, podrás darte de baja de forma
        sencilla.
      </P>

      <H2>9. Usos no permitidos</H2>
      <P>
        No puedes suplantar a otra persona, proporcionar deliberadamente información fraudulenta, utilizar el
        servicio para fines ilícitos, vulnerar derechos de terceros, intentar acceder sin autorización a sistemas o
        cuentas, introducir malware, realizar automatizaciones abusivas, degradar el servicio, hacer scraping masivo
        no autorizado ni utilizar datos obtenidos a través de BeWay para discriminación ilícita, acoso o fines
        incompatibles con el servicio.
      </P>

      <H2>10. Oportunidades y resultados</H2>
      <P>
        BeWay facilita herramientas de perfil, conexión y acceso a oportunidades. Crear o utilizar una cuenta no
        garantiza entrevistas, procesos de selección, contratación, becas, colaboraciones, participación en
        proyectos ni ningún resultado profesional concreto. Las decisiones de empresas u organizaciones externas
        corresponden a dichas entidades, sin perjuicio de las obligaciones que BeWay asuma expresamente en cada
        funcionalidad.
      </P>

      <H2>11. Disponibilidad y cambios</H2>
      <P>
        Al tratarse de un servicio previo al lanzamiento, BeWay podrá modificar, añadir, suspender o retirar
        funcionalidades. Cuando una modificación afecte de forma relevante a la relación con el usuario o al
        tratamiento de sus datos, se facilitará la información o se solicitará la aceptación que corresponda.
      </P>

      <H2>12. Suspensión y cancelación</H2>
      <P>
        Podremos suspender o cancelar cuentas en caso de incumplimiento grave de estos Términos, uso ilícito,
        fraude, riesgo de seguridad o cuando resulte necesario para proteger a usuarios o al servicio. Puedes
        solicitar la eliminación de tu cuenta en cualquier momento mediante las funciones disponibles o escribiendo a
        {" "}
        {PRIVACY_CONTACT_EMAIL}.
      </P>

      <H2>13. Propiedad intelectual</H2>
      <P>
        La marca BeWay, el software, diseño, elementos gráficos, documentación y demás contenidos propios del
        servicio están protegidos por la normativa aplicable y pertenecen a sus respectivos titulares. Estos
        Términos no transfieren al usuario derechos de propiedad sobre dichos elementos.
      </P>

      <H2>14. Responsabilidad</H2>
      <P>
        BeWay prestará el servicio con la diligencia razonablemente exigible. En la medida permitida por la
        legislación aplicable, BeWay no será responsable de decisiones adoptadas por empresas externas, contenidos
        introducidos por usuarios o interrupciones derivadas de causas fuera de su control razonable. Nada en estos
        Términos limita derechos irrenunciables del usuario ni excluye responsabilidades que legalmente no puedan
        excluirse.
      </P>

      <H2>15. Contratación electrónica</H2>
      <P>
        Para crear la cuenta deberás completar el formulario, revisar la información, aceptar estos Términos y
        pulsar «Crear mi cuenta». Antes de enviarlo podrás corregir los datos introducidos. BeWay conservará
        electrónicamente evidencia de la versión de los Términos aceptada y del momento de aceptación. La cuenta se
        considerará creada cuando el sistema confirme el registro, sin perjuicio de los pasos de verificación de
        correo que puedan resultar necesarios.
      </P>

      <H2>16. Legislación aplicable</H2>
      <P>
        Estos Términos se regirán por la legislación española en la medida legalmente permitida, sin perjuicio de
        las normas imperativas y derechos que puedan corresponder al usuario conforme a la legislación aplicable en
        su lugar de residencia.
      </P>

      <H2>17. Cambios en los Términos</H2>
      <P>
        Podremos actualizar estos Términos cuando cambie el servicio o resulte necesario por razones legales,
        técnicas o de seguridad. Los cambios materiales se comunicarán de forma adecuada y, cuando resulte
        necesario, se solicitará una nueva aceptación.
      </P>
    </div>
  );
}

// Bloque corto (BEWAY | Pre-Registro · Cambios UX + legal, sección 3.2):
// el que se despliega en "Información básica de privacidad · Ver detalles"
// dentro del formulario de registro, antes de crear la cuenta. Distinto de
// PrivacidadContent (la política completa en /privacidad).
export function PrivacyNoticeSummary() {
  return (
    <p className="font-body text-[12px] leading-relaxed text-text-muted">
      Responsable: [RAZÓN SOCIAL], NIF [NIF], [DOMICILIO]. Usaremos tus datos para crear y gestionar tu cuenta,
      guardar tu CV Vivo y prestar el Pre-Registro. La base principal es la prestación del servicio que solicitas.
      Si aceptas comunicaciones, utilizaremos tu correo sobre la base de tu consentimiento. Puedes ejercer tus
      derechos en {PRIVACY_CONTACT_EMAIL}. Más información en la Política de Privacidad.
    </p>
  );
}

export function PrivacidadContent() {
  return (
    <div>
      <VersionNote version={PRIVACY_NOTICE_VERSION} />

      <H2>1. Responsable del tratamiento</H2>
      <P>
        El responsable del tratamiento es [RAZÓN SOCIAL COMPLETA], con NIF [NIF], domicilio en [DOMICILIO] y
        operador de la marca y servicio BeWay. Para cualquier cuestión relacionada con privacidad o para ejercer tus
        derechos puedes escribir a {PRIVACY_CONTACT_EMAIL}. Si BeWay designa formalmente un Delegado de Protección
        de Datos, sus datos de contacto se incorporarán aquí.
      </P>

      <H2>2. Qué datos tratamos</H2>
      <P>
        Dependiendo de cómo utilices el Pre-Registro, podremos tratar tu nombre y correo electrónico; datos de
        cuenta, autenticación, preferencias y seguridad; país de residencia; información académica y profesional que
        decidas añadir a tu CV Vivo; proyectos, habilidades, evidencias y otros contenidos que subas; información
        técnica necesaria para funcionamiento, seguridad y prevención de abuso; y tus preferencias de comunicaciones
        y visibilidad. No te pediremos datos especialmente sensibles que no sean necesarios para un perfil
        profesional estándar.
      </P>

      <H2>3. Para qué usamos tus datos</H2>
      <P>
        Usamos tus datos para crear y gestionar tu cuenta; guardar, editar y mantener tu CV Vivo; verificar el
        acceso y proteger la cuenta; atender soporte y solicitudes; dar continuidad técnica al servicio cuando se
        lance la plataforma definitiva; permitirte configurar, cuando exista la funcionalidad, la visibilidad de tu
        CV Vivo; y cumplir obligaciones legales o atender requerimientos de autoridades competentes. Si además
        marcas la casilla opcional de comunicaciones, utilizaremos tu correo para enviarte oportunidades, eventos,
        encuestas, novedades y contenidos de BeWay.
      </P>

      <H2>4. Base jurídica</H2>
      <P>
        La creación y gestión de la cuenta, el almacenamiento del CV Vivo y las funciones que solicites se apoyan
        principalmente en la ejecución del servicio solicitado y, cuando corresponda, en medidas precontractuales.
        Determinadas medidas de seguridad pueden apoyarse también en nuestro interés legítimo en proteger el
        servicio y a sus usuarios. Las comunicaciones promocionales se basarán en tu consentimiento cuando esa sea
        la base aplicable. Los tratamientos necesarios para cumplir obligaciones legales se apoyarán en la
        obligación correspondiente.
      </P>

      <H2>5. Visibilidad del CV Vivo</H2>
      <P>
        Crear una cuenta no hace público tu CV Vivo ni lo comparte automáticamente con empresas. La configuración
        inicial será privada. Cuando BeWay habilite la conexión con empresas, podrás decidir si quieres que tu perfil
        sea visible para empresas verificadas del ecosistema. Activar esa visibilidad no implica necesariamente
        mostrar datos de contacto como tu email o teléfono; BeWay podrá facilitar el contacto inicialmente dentro de
        la propia plataforma.
      </P>

      <H2>6. Paso del Pre-Registro a BeWay definitivo</H2>
      <P>
        Cuando se lance la plataforma definitiva, los datos de tu cuenta y de tu CV Vivo podrán trasladarse
        técnicamente al nuevo entorno para dar continuidad al servicio que has solicitado. Esa migración no hará
        público tu perfil, no activará automáticamente visibilidad frente a empresas y no modificará por sí sola tu
        preferencia de comunicaciones. Antes del lanzamiento te informaremos de cambios relevantes. Si cambia el
        responsable, aparecen finalidades nuevas incompatibles, se incorporan destinatarios distintos o resulta
        necesaria otra base jurídica, se realizará el análisis correspondiente y se proporcionará la información o
        autorización que proceda.
      </P>

      <H2>7. Proveedores y destinatarios</H2>
      <P>
        BeWay podrá utilizar proveedores necesarios para prestar el servicio, como alojamiento, infraestructura,
        autenticación, base de datos, seguridad, almacenamiento, correo electrónico, soporte o logging. Estos
        proveedores deberán tratar los datos conforme al rol, contrato y garantías que correspondan. [COMPLETAR TRAS
        INVENTARIO: categorías o lista de proveedores]. Las empresas del ecosistema no tendrán acceso a tu CV Vivo
        por el mero hecho de que hayas creado una cuenta; ese acceso solo se habilitará cuando exista la
        funcionalidad correspondiente y tú hayas elegido una configuración de visibilidad que lo permita.
      </P>

      <H2>8. Transferencias internacionales</H2>
      <P>
        Algunos proveedores pueden estar establecidos o permitir acceso desde países situados fuera del Espacio
        Económico Europeo. Cuando exista una transferencia internacional sujeta al RGPD, BeWay utilizará los
        mecanismos legalmente previstos, como decisiones de adecuación o garantías adecuadas, incluidas cuando
        proceda las Cláusulas Contractuales Tipo. [COMPLETAR TRAS INVENTARIO: países, proveedores, mecanismos y
        forma de obtener información adicional].
      </P>

      <H2>9. Conservación</H2>
      <P>
        Conservaremos tus datos únicamente durante el tiempo necesario para prestar el servicio, atender las
        finalidades informadas y cumplir las obligaciones o responsabilidades aplicables. Los plazos concretos se
        definirán con Legal y Tecnología [ver docs/pending-decisions.md #1]. Cuando solicites la supresión,
        eliminaremos o bloquearemos los datos según corresponda y las copias de seguridad se purgarán conforme al
        ciclo técnico documentado.
      </P>

      <H2>10. Tus derechos</H2>
      <P>
        Puedes solicitar acceso a tus datos, rectificación, supresión, limitación, oposición y, cuando corresponda,
        portabilidad. Cuando un tratamiento se base en tu consentimiento, puedes retirarlo en cualquier momento sin
        afectar a la licitud del tratamiento realizado antes de la retirada. Puedes ejercer tus derechos en{" "}
        {PRIVACY_CONTACT_EMAIL} o mediante las herramientas habilitadas en tu cuenta. Si existen dudas razonables
        sobre tu identidad, podremos pedir información adicional de forma proporcionada. También puedes presentar
        una reclamación ante la Agencia Española de Protección de Datos, sin perjuicio de otros derechos que puedan
        corresponderte.
      </P>

      <H2>11. Comunicaciones</H2>
      <P>
        Los mensajes necesarios para crear, mantener, asegurar o gestionar tu cuenta —como verificación,
        recuperación de contraseña, avisos de seguridad o información necesaria sobre el lanzamiento y continuidad
        del servicio— podrán enviarse cuando resulten necesarios para prestar el servicio. Las oportunidades,
        eventos, encuestas, novedades o contenidos promocionales se enviarán únicamente cuando exista una base
        jurídica que lo permita. Si dependen de tu consentimiento, podrás darte de baja de forma sencilla y
        gratuita.
      </P>

      <H2>12. Menores</H2>
      <P>
        En el Pre-Registro actual no se exige una edad mínima distinta de la general para contratar servicios de la
        sociedad de la información [ver docs/pending-decisions.md #5, política de edad mínima pendiente de decidir
        con Negocio y Legal].
      </P>

      <H2>13. Decisiones automatizadas e IA</H2>
      <P>
        En el Pre-Registro actual, BeWay no adopta decisiones basadas únicamente en tratamientos automatizados que
        produzcan efectos jurídicos sobre el usuario o le afecten significativamente de forma similar. Antes de
        desplegar scoring, ranking, filtrado, selección o evaluación automatizada de candidatos, BeWay revisará
        específicamente las obligaciones aplicables en materia de protección de datos e inteligencia artificial y
        facilitará la información correspondiente.
      </P>

      <H2>14. Cookies</H2>
      <P>
        La información sobre cookies y tecnologías similares se encuentra en la Política de Cookies. Las
        tecnologías opcionales que requieran consentimiento no se activarán hasta que el usuario haya elegido
        aceptarlas.
      </P>

      <H2>15. Cambios en esta política</H2>
      <P>
        Podremos actualizar esta Política de Privacidad cuando cambie el servicio, la normativa o la forma en que
        tratamos los datos. Cuando los cambios sean relevantes, los comunicaremos por medios adecuados y, cuando sea
        necesario, antes de que resulten aplicables.
      </P>
    </div>
  );
}

export function AvisoLegalContent() {
  return (
    <div>
      <VersionNote version={AVISO_LEGAL_VERSION} />

      <H2>1. Titular del sitio</H2>
      <P>
        Titular: [RAZÓN SOCIAL COMPLETA]. Nombre comercial: BeWay. NIF: [NIF]. Domicilio social: [DOMICILIO]. Correo
        general: {GENERAL_CONTACT_EMAIL}. Correo de privacidad: {PRIVACY_CONTACT_EMAIL}. Datos registrales:
        [REGISTRO MERCANTIL / TOMO / FOLIO / HOJA / INSCRIPCIÓN, cuando proceda].
      </P>

      <H2>2. Finalidad</H2>
      <P>
        Este sitio corresponde al Pre-Registro de BeWay y permite a los usuarios crear una cuenta y preparar su CV
        Vivo antes del lanzamiento de la plataforma definitiva.
      </P>

      <H2>3. Acceso y uso</H2>
      <P>
        El acceso a las páginas públicas es libre, sin perjuicio de que determinadas funciones requieran registro y
        aceptación de los Términos de Uso. El usuario debe utilizar el sitio y sus funcionalidades de forma lícita y
        respetuosa con derechos de terceros.
      </P>

      <H2>4. Propiedad intelectual e industrial</H2>
      <P>
        Los elementos propios del sitio, incluidos software, textos, diseño, marcas, logotipos y recursos gráficos,
        están protegidos por la normativa aplicable. No se concede ninguna licencia distinta de la necesaria para
        utilizar el servicio conforme a sus Términos.
      </P>

      <H2>5. Enlaces y servicios de terceros</H2>
      <P>
        El sitio puede contener enlaces o integraciones de terceros. Cuando dichos servicios sean independientes de
        BeWay, se regirán por sus propias condiciones y políticas.
      </P>

      <H2>6. Contacto</H2>
      <P>
        Para cuestiones generales: {GENERAL_CONTACT_EMAIL}. Para privacidad y ejercicio de derechos:{" "}
        {PRIVACY_CONTACT_EMAIL}.
      </P>
    </div>
  );
}

export function CookiesContent() {
  return (
    <div>
      <VersionNote version={COOKIES_POLICY_VERSION} />

      <H2>1. Qué son las cookies y tecnologías similares</H2>
      <P>
        Las cookies y tecnologías similares permiten almacenar o acceder a información en el dispositivo del usuario
        para finalidades como funcionamiento técnico, seguridad, preferencias, analítica o publicidad.
      </P>

      <H2>2. Qué utiliza BeWay</H2>
      <P>
        BeWay utiliza únicamente las tecnologías necesarias para permitir el funcionamiento y la seguridad del
        Pre-Registro (sesión, autenticación y protección anti-abuso). Hoy no hay tecnologías opcionales de analítica,
        publicidad o session replay activas — CLAUDE.md prioriza analítica cookieless precisamente para evitar
        necesitar un banner de consentimiento (LSSI-CE). Si en el futuro se incorpora alguna, no se activará hasta
        que el usuario haya elegido aceptarla, y esta página se actualizará con el inventario correspondiente.
      </P>

      <H2>3. Cómo gestionamos tu elección</H2>
      <P>
        Mientras BeWay solo use tecnologías necesarias, no verás un banner de consentimiento. Si se incorpora alguna
        tecnología opcional, podrás ACEPTAR, RECHAZAR o CONFIGURAR su uso desde el panel correspondiente —las
        opciones de aceptar y rechazar se mostrarán siempre al mismo nivel— y cambiar tu elección en cualquier
        momento desde «Configurar cookies» en el footer.
      </P>

      <H2>4. Tabla de tecnologías</H2>
      <div className="mt-3 overflow-x-auto rounded-md border border-border-subtle">
        <table className="w-full text-left font-body text-small">
          <thead className="bg-surface-sunken text-text-heading">
            <tr>
              <th className="px-3 py-2 font-semibold">Nombre / tecnología</th>
              <th className="px-3 py-2 font-semibold">Proveedor</th>
              <th className="px-3 py-2 font-semibold">Finalidad</th>
              <th className="px-3 py-2 font-semibold">Categoría</th>
              <th className="px-3 py-2 font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody className="text-text-muted">
            <tr className="border-t border-border-subtle">
              <td className="px-3 py-2">Cookies de sesión (Supabase Auth)</td>
              <td className="px-3 py-2">Supabase</td>
              <td className="px-3 py-2">Mantener la sesión iniciada</td>
              <td className="px-3 py-2">Necesaria</td>
              <td className="px-3 py-2">Sesión</td>
            </tr>
            <tr className="border-t border-border-subtle">
              <td className="px-3 py-2">Verificación anti-bot</td>
              <td className="px-3 py-2">Cloudflare Turnstile</td>
              <td className="px-3 py-2">Prevenir registros automatizados</td>
              <td className="px-3 py-2">Necesaria</td>
              <td className="px-3 py-2">[COMPLETAR]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H2>5. Cambios</H2>
      <P>
        Esta Política podrá actualizarse cuando cambien las tecnologías utilizadas. La fecha y versión vigentes se
        muestran arriba.
      </P>
    </div>
  );
}
