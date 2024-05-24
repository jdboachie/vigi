SELECT *
FROM "Event"
JOIN "User" ON "Event"."organizerId" = "User"."id"
ORDER BY "Event"."id" DESC