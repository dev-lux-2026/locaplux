import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // 🔥 Récupération correcte de la session côté serveur
    const session = await getServerSession(authOptions);

    // 🔥 Vérification du rôle (normalisé en minuscules)
    if (!session || session.user.role?.toLowerCase() !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = session.user.id;

    /* -------------------------------------------------------------------------- */
    /*                                   STATS                                    */
    /* -------------------------------------------------------------------------- */

    const totalOrders = await prisma.order.count({
      where: { partnerId },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { partnerId },
      _sum: { total: true },
    });

    const activeProducts = await prisma.product.count({
      where: { partnerId, active: true },
    });

    /* -------------------------------------------------------------------------- */
    /*                             COMMANDES RÉCENTES                              */
    /* -------------------------------------------------------------------------- */

    const recentOrders = await prisma.order.findMany({
      where: { partnerId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    /* -------------------------------------------------------------------------- */
    /*                             PRODUITS RÉCENTS                                */
    /* -------------------------------------------------------------------------- */

    const recentProducts = await prisma.product.findMany({
      where: { partnerId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    /* -------------------------------------------------------------------------- */
    /*                                 ANALYTICS                                   */
    /* -------------------------------------------------------------------------- */

    const analytics = {
      monthlyVisits: 1234,
      conversionRate: 4.7,
    };

    /* -------------------------------------------------------------------------- */
    /*                                   RETURN                                    */
    /* -------------------------------------------------------------------------- */

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        activeProducts,
      },
      recentOrders,
      recentProducts,
      analytics,
    });

  } catch (error) {
    console.error("Erreur API dashboard partenaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
