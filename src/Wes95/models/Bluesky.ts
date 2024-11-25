import { z } from 'zod';

export const Bluesky_UnknownTypeSchema = z
  .object({
    $type: z.string(),
  })
  .passthrough();

export const Bluesky_Repo_StrongRefSchema = z.object({
  $type: z.literal('com.atproto.repo.strongRef#main').optional(),
  uri: z.string(),
  cid: z.string(),
});

export const Bluesky_Label_LabelSchema = z.object({
  $type: z.literal('com.atproto.label.defs#label').optional(),
  ver: z.number().optional(),
  src: z.string(),
  uri: z.string(),
  cid: z.string().optional(),
  val: z.string(),
  neg: z.boolean().optional(),
  cts: z.string(),
  exp: z.string().optional(),
});

export const Bluesky_Actor_ProfileAssociatedChatSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileAssociatedChat').optional(),
  allowIncoming: z.union([
    z.literal('all'),
    z.literal('none'),
    z.literal('following'),
    z.string(),
  ]),
});

export const Bluesky_Actor_ProfileAssociatedSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileAssociated').optional(),
  lists: z.number().optional(),
  feedgens: z.number().optional(),
  starterPacks: z.number().optional(),
  labeler: z.boolean().optional(),
  chat: Bluesky_Actor_ProfileAssociatedChatSchema.optional(),
});

export const Bluesky_Actor_ProfileViewBasicSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileViewBasic').optional(),
  did: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  associated: Bluesky_Actor_ProfileAssociatedSchema.optional(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
  createdAt: z.string().optional(),
});

export const Bluesky_Actor_ProfileViewDetailedSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileViewDetailed').optional(),
  associated: Bluesky_Actor_ProfileAssociatedSchema.optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  createdAt: z.string().optional(),
  description: z.string().optional(),
  did: z.string(),
  displayName: z.string().optional(),
  followersCount: z.number().optional(),
  followsCount: z.number().optional(),
  handle: z.string(),
  indexedAt: z.string().optional(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
  pinnedPost: Bluesky_Repo_StrongRefSchema.optional(),
  postsCount: z.number().optional(),
});

export const Bluesky_Embed_AspectRatioSchema = z.object({
  $type: z.literal('app.bsky.embed.defs#aspectRatio'),
  height: z.number(),
  width: z.number(),
});

export const Bluesky_Embed_ExternalViewExternalSchema = z.object({
  $type: z.literal('app.bsky.embed.external#viewExternal').optional(),
  description: z.string(),
  thumb: z.string().optional(),
  title: z.string(),
  uri: z.string(),
});

export const Bluesky_Embed_ExternalViewSchema = z.object({
  $type: z.literal('app.bsky.embed.external#view').optional(),
  external: Bluesky_Embed_ExternalViewExternalSchema,
});

export const Bluesky_Embed_ImageViewSchema = z.object({
  $type: z.literal('app.bsky.embed.images#image').optional(),
  alt: z.string(),
  aspectRatio: Bluesky_Embed_AspectRatioSchema.optional(),
  fullsize: z.string(),
  thumb: z.string(),
});

export const Bluesky_Embed_ImagesViewSchema = z.object({
  $type: z.literal('app.bsky.embed.images#view').optional(),
  images: z.array(Bluesky_Embed_ImageViewSchema),
});

export const Bluesky_Embed_RecordViewBlockedPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewBlocked'),
  blocked: z.literal(true),
  uri: z.string(),
});

export const Bluesky_Embed_RecordViewDetachedPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewDetached'),
  detached: z.literal(true),
  uri: z.string(),
});

export const Bluesky_Embed_RecordViewNotFoundPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewNotFound'),
  notFound: z.literal(true),
  uri: z.string(),
});

export const Bluesky_Embed_VideoViewSchema = z.object({
  $type: z.literal('app.bsky.embed.images#image').optional(),
  aspectRatio: Bluesky_Embed_AspectRatioSchema.optional(),
  alt: z.string().optional(),
  cid: z.string(),
  playlist: z.string(),
  thumbnail: z.string().optional(),
});

export const Bluesky_Embed_RecordViewRecordSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewRecord').optional(),
  author: Bluesky_Actor_ProfileViewBasicSchema,
  cid: z.string(),
  embeds: z
    .array(
      z.union([
        Bluesky_Embed_ImagesViewSchema,
        Bluesky_Embed_VideoViewSchema,
        Bluesky_Embed_ExternalViewSchema,
        // --- Infinite Recursion ---
        // Bluesky_Embed_RecordViewSchema,
        // Bluesky_Embed_RecordWithMediaViewSchema,
        Bluesky_UnknownTypeSchema,
      ]),
    )
    .optional(),
  indexedAt: z.string(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
  likeCount: z.number().optional(),
  quoteCount: z.number().optional(),
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  uri: z.string(),
  value: z.object({}),
});

export const Bluesky_Embed_RecordViewSchema = z.object({
  $type: z.literal('app.bsky.embed.record#view').optional(),
  record: z.union([
    Bluesky_Embed_RecordViewBlockedPostSchema,
    Bluesky_Embed_RecordViewDetachedPostSchema,
    Bluesky_Embed_RecordViewNotFoundPostSchema,
    Bluesky_Embed_RecordViewRecordSchema,
    Bluesky_UnknownTypeSchema,
  ]),
});

export const Bluesky_Embed_RecordWithMediaViewSchema = z.object({
  $type: z.literal('app.bsky.embed.recordWithMedia#view').optional(),
  record: Bluesky_Embed_RecordViewSchema,
  media: z.union([
    Bluesky_Embed_ImagesViewSchema,
    Bluesky_Embed_VideoViewSchema,
    Bluesky_Embed_ExternalViewSchema,
    Bluesky_UnknownTypeSchema,
  ]),
});

export const Bluesky_Feed_PostViewSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#postView').optional(),
  author: Bluesky_Actor_ProfileViewBasicSchema,
  cid: z.string(),
  embed: z
    .union([
      Bluesky_Embed_ImagesViewSchema,
      Bluesky_Embed_VideoViewSchema,
      Bluesky_Embed_ExternalViewSchema,
      Bluesky_Embed_RecordViewSchema,
      Bluesky_Embed_RecordWithMediaViewSchema,
      Bluesky_UnknownTypeSchema,
    ])
    .optional(),
  indexedAt: z.string(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
  likeCount: z.number().optional(),
  quoteCount: z.number().optional(),
  // --- Fucking bluesky complex types ---
  // record: Bluesky_UnknownTypeSchema,
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  uri: z.string(),
});

export const Bluesky_Feed_BlockedPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#blockedPost'),
  blocked: z.literal(true),
  uri: z.string(),
});

export const Bluesky_Feed_NotFoundPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#notFoundPost'),
  notFound: z.literal(true),
  uri: z.string(),
});

export const Bluesky_Feed_ReplySchema = z.object({
  $type: z.literal('app.bsky.feed.defs#replyRef').optional(),
  grandparentAuthor: Bluesky_Actor_ProfileViewBasicSchema.optional(),
  parent: z.union([
    Bluesky_Feed_PostViewSchema,
    Bluesky_Feed_NotFoundPostSchema,
    Bluesky_Feed_BlockedPostSchema,
    Bluesky_UnknownTypeSchema,
  ]),
  root: z.union([
    Bluesky_Feed_PostViewSchema,
    Bluesky_Feed_NotFoundPostSchema,
    Bluesky_Feed_BlockedPostSchema,
    Bluesky_UnknownTypeSchema,
  ]),
});

export const Bluesky_Feed_ReasonRepostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#reasonRepost'),
});

export const Bluesky_Feed_ReasonPinSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#reasonPin'),
});

export const Bluesky_Feed_ViewPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#feedViewPost').optional(),
  post: Bluesky_Feed_PostViewSchema,
  reason: z
    .union([
      Bluesky_Feed_ReasonRepostSchema,
      Bluesky_Feed_ReasonPinSchema,
      Bluesky_UnknownTypeSchema,
    ])
    .optional(),
  reply: Bluesky_Feed_ReplySchema.optional(),
});
