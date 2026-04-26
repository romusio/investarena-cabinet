import { PrismaClient, RewardType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const items = [
        { title: "Кэшбэк 300 ₽", type: RewardType.CASHBACK, costPoints: 300, value: 300, stock: null, isActive: true },
        { title: "Кэшбэк 500 ₽", type: RewardType.CASHBACK, costPoints: 450, value: 500, stock: null, isActive: true },
        { title: "Игровые часы: 2 часа", type: RewardType.GAME_HOURS, costPoints: 200, value: 2, stock: null, isActive: true },
        { title: "Игровые часы: 5 часов", type: RewardType.GAME_HOURS, costPoints: 450, value: 5, stock: null, isActive: true },
        { title: "Мерч: футболка", type: RewardType.MERCH, costPoints: 900, value: null, stock: 10, isActive: true },
        { title: "Мерч: худи", type: RewardType.MERCH, costPoints: 1400, value: null, stock: 5, isActive: true },
    ];

    for (const item of items) {
        await prisma.rewardItem.upsert({
            where: { title: item.title },
            update: item,
            create: item,
        });
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });