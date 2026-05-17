import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaults = [
    {
      key: "first_login",
      title: "Первый вход",
      description: "Впервые войдите в личный кабинет.",
      category: "Активность",
      icon: "⚡️",
    },
    {
      key: "first_action",
      title: "Первое действие",
      description: "Совершите первое действие в кабинете.",
      category: "Активность",
      icon: "🎯",
    },
    {
      key: "five_actions",
      title: "5 действий",
      description: "Выполните 5 действий в системе.",
      category: "Активность",
      icon: "🔥",
    },
    {
      key: "ten_actions",
      title: "10 действий",
      description: "Выполните 10 действий в системе.",
      category: "Активность",
      icon: "🚀",
    },
    {
      key: "first_task",
      title: "Первое задание",
      description: "Завершите любое ежедневное задание.",
      category: "Задания",
      icon: "✅",
    },
    {
      key: "three_tasks_day",
      title: "3 задания за день",
      description: "Выполните 3 задания за один день.",
      category: "Задания",
      icon: "📘",
    },
    {
      key: "first_purchase",
      title: "Первая покупка",
      description: "Обменяйте StrikeCoin в магазине.",
      category: "Магазин",
      icon: "🛒",
    },
    {
      key: "game_hours",
      title: "Игровые часы",
      description: "Получите награду категории игровые часы.",
      category: "Магазин",
      icon: "🎮",
    },
    {
      key: "level_3",
      title: "Уровень 3",
      description: "Достигните 3 уровня аккаунта.",
      category: "Прогресс",
      icon: "⭐️",
    },
    {
      key: "xp_100",
      title: "100 XP",
      description: "Накопите суммарно 100 XP.",
      category: "Прогресс",
      icon: "💎",
    },
    {
      key: "coins_250",
      title: "250 StrikeCoin",
      description: "Накопите 250 StrikeCoin.",
      category: "Прогресс",
      icon: "🪙",
    },
    {
      key: "open_store",
      title: "Открыть магазин",
      description: "Посетите страницу магазина наград.",
      category: "Магазин",
      icon: "🎁",
    },
  ];

  async ensureDefaults() {
    for (const item of this.defaults) {
      await this.prisma.achievement.upsert({
        where: { key: item.key },
        update: item,
        create: item,
      });
    }
  }

  async listForUser(userId: string) {
    await this.ensureDefaults();

    const [achievements, unlocked, user, taskCount, purchaseCount] =
      await Promise.all([
        this.prisma.achievement.findMany({
          orderBy: { createdAt: "asc" },
        }),
        this.prisma.userAchievement.findMany({
          where: { userId },
          select: { achievementId: true, unlockedAt: true },
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            xp: true,
            level: true,
            points: true,
          },
        }),
        this.prisma.userTaskClaim.count({
          where: { userId },
        }),
        this.prisma.rewardRedemption.count({
          where: { userId },
        }),
      ]);

    const unlockedMap = new Map(
      unlocked.map((item) => [item.achievementId, item.unlockedAt])
    );

    const openStoreAchievement = achievements.find((item) => item.key === "open_store");
    const openStoreDone = openStoreAchievement
      ? unlockedMap.has(openStoreAchievement.id)
      : false;

    const actionCount = taskCount + purchaseCount + (openStoreDone ? 1 : 0);

    function getProgress(key: string) {
      if (key === "first_action") return { progress: Math.min(actionCount, 1), total: 1 };
      if (key === "five_actions") return { progress: Math.min(actionCount, 5), total: 5 };
      if (key === "ten_actions") return { progress: Math.min(actionCount, 10), total: 10 };
      if (key === "first_login") {
        const firstLoginAchievement = achievements.find((a) => a.key === "first_login");
        return {
          progress: firstLoginAchievement && unlockedMap.has(firstLoginAchievement.id) ? 1 : 0,
          total: 1,
        };
      }
      if (key === "first_task") return { progress: Math.min(taskCount, 1), total: 1 };      if (key === "three_tasks_day") return { progress: Math.min(taskCount, 3), total: 3 };
      if (key === "first_purchase") return { progress: Math.min(purchaseCount, 1), total: 1 };
      if (key === "game_hours") return { progress: 0, total: 1 };
      if (key === "level_3") return { progress: Math.min(user?.level ?? 1, 3), total: 3 };
      if (key === "xp_100") return { progress: Math.min(user?.xp ?? 0, 100), total: 100 };
      if (key === "coins_250") return { progress: Math.min(user?.points ?? 0, 250), total: 250 };

      return { progress: 0, total: 1 };
    }

    return achievements.map((item) => {
      const progressInfo = getProgress(item.key);

      return {
        id: item.id,
        key: item.key,
        title: item.title,
        description: item.description,
        category: item.category,
        icon: item.icon,
        done: unlockedMap.has(item.id) || progressInfo.progress >= progressInfo.total,
        unlockedAt: unlockedMap.get(item.id) ?? null,
        progress: progressInfo.progress,
        total: progressInfo.total,
      };
    });
  }

  async unlock(userId: string, key: string) {
    await this.ensureDefaults();

    const achievement = await this.prisma.achievement.findUnique({
      where: { key },
    });

    if (!achievement) {
      throw new Error("Достижение не найдено");
    }

    await this.prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
      update: {},
      create: {
        userId,
        achievementId: achievement.id,
      },
    });

    return this.listForUser(userId);
  }
  async unlockByKey(userId: string, key: string) {
    await this.ensureDefaults();

    const achievement = await this.prisma.achievement.findUnique({
      where: { key },
    });

    if (!achievement) {
      return null;
    }

    const unlocked = await this.prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
      update: {},
      create: {
        userId,
        achievementId: achievement.id,
      },
    });

    return unlocked;
  }

  async checkProgressAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        points: true,
      },
    });

    if (!user) return;

    if (user.level >= 3) {
      await this.unlockByKey(userId, "level_3");
    }

    if (user.xp >= 100) {
      await this.unlockByKey(userId, "xp_100");
    }

    if (user.points >= 250) {
      await this.unlockByKey(userId, "coins_250");
    }
    const taskCount = await this.prisma.userTaskClaim.count({
      where: { userId },
    });

    const purchaseCount = await this.prisma.rewardRedemption.count({
      where: { userId },
    });

    const openStoreAchievement = await this.prisma.achievement.findUnique({
      where: { key: "open_store" },
    });

    const openStoreDone = openStoreAchievement
      ? await this.prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: openStoreAchievement.id,
          },
        },
      })
      : null;

    const actionCount = taskCount + purchaseCount + (openStoreDone ? 1 : 0);

    if (actionCount >= 1) {
      await this.unlockByKey(userId, "first_action");
    }

    if (actionCount >= 5) {
      await this.unlockByKey(userId, "five_actions");
    }

    if (actionCount >= 10) {
      await this.unlockByKey(userId, "ten_actions");
    }
  }
}