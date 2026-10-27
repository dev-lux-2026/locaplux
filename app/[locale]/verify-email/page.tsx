import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

type VerifyEmailProps = {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
  params: Promise<{
    locale: string;
  }>;
};

export default async function VerifyEmailPage(props: VerifyEmailProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const { locale } = resolvedParams;
  const token = resolvedSearchParams.token;
  const email = resolvedSearchParams.email || "";

  // 📬 CAS 1 : Aucun jeton dans l'URL -> Affichage de l'écran d'attente graphique
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center text-black">
        <div className="bg-white dark:bg-[#111] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col items-center">
          {/* Icône Enveloppe */}
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mb-6 text-blue-600">
            <svg xmlns="http://w3.org" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.8a2 2 0 012.22 0l8 4.8A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Vérifiez votre boîte mail
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            Un e-mail de confirmation vient d’être envoyé.
            {email && (
              <>
                {" "}à l'adresse <strong className="text-black dark:text-white break-all">{decodeURIComponent(email)}</strong>.
              </>
            )}
            {" "}Veuillez cliquer sur le lien contenu dans le message pour valider votre compte et poursuivre votre inscription.
          </p>

          <div className="w-full space-y-3">
            <Link
              href={`/${locale}/login`}
              className="block w-full text-center px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition text-sm font-medium"
            >
              Retour à la page de connexion
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Vous ne trouvez pas l'e-mail ? Pensez à vérifier vos courriers indésirables (spams).
        </p>
      </div>
    );
  }

  // 🔏 CAS 2 : Un jeton est présent -> Validation stricte côté serveur
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-6 bg-white rounded-xl shadow-sm border text-black">
        <h1 className="text-xl font-bold text-red-600 mb-2">Lien expiré ou invalide</h1>
        <p className="text-gray-600 mb-4">Le jeton de validation a expiré ou a déjà été validé.</p>
        <Link href={`/${locale}/login`} className="text-black underline font-medium text-sm">
          Retour à la page de connexion
        </Link>
      </div>
    );
  }

  // Validation de l'utilisateur en base de données
  const user = await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // Suppression du jeton à usage unique
  await prisma.verificationToken.delete({ 
    where: { token } 
  });

  // Redirection propre vers la page de connexion avec les drapeaux de succès
  redirect(`/${locale}/login?verified=true&email=${encodeURIComponent(user.email)}`);
}
