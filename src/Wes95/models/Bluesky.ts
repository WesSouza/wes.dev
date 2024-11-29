import { z } from 'zod';

export type Bluesky_UnknownType = z.infer<typeof Bluesky_UnknownTypeSchema>;

export const Bluesky_UnknownTypeSchema = z
  .object({
    $type: z.string(),
  })
  .passthrough();

export type Bluesky_Repo_StrongRef = z.infer<
  typeof Bluesky_Repo_StrongRefSchema
>;

export const Bluesky_Repo_StrongRefSchema = z.object({
  $type: z.literal('com.atproto.repo.strongRef#main').optional(),
  uri: z.string(),
  cid: z.string(),
});

export type Bluesky_Label_Label = z.infer<typeof Bluesky_Label_LabelSchema>;

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

export type Bluesky_Actor_ProfileAssociatedChat = z.infer<
  typeof Bluesky_Actor_ProfileAssociatedChatSchema
>;

export const Bluesky_Actor_ProfileAssociatedChatSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileAssociatedChat').optional(),
  allowIncoming: z.union([
    z.literal('all'),
    z.literal('none'),
    z.literal('following'),
    z.string(),
  ]),
});

export type Bluesky_Actor_ProfileAssociated = z.infer<
  typeof Bluesky_Actor_ProfileAssociatedSchema
>;

export const Bluesky_Actor_ProfileAssociatedSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileAssociated').optional(),
  lists: z.number().optional(),
  feedgens: z.number().optional(),
  starterPacks: z.number().optional(),
  labeler: z.boolean().optional(),
  chat: Bluesky_Actor_ProfileAssociatedChatSchema.optional(),
});

export type Bluesky_Actor_ProfileViewBasic = z.infer<
  typeof Bluesky_Actor_ProfileViewBasicSchema
>;

export const Bluesky_Actor_ProfileViewBasicSchema = z.object({
  $type: z.literal('app.bsky.actor.defs#profileViewBasic').optional(),
  associated: Bluesky_Actor_ProfileAssociatedSchema.optional(),
  avatar: z.string().optional(),
  createdAt: z.string().optional(),
  did: z.string(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  handle: z.string(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
});

export type Bluesky_Actor_ProfileViewDetailed = z.infer<
  typeof Bluesky_Actor_ProfileViewDetailedSchema
>;

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

export type Bluesky_Embed_AspectRatio = z.infer<
  typeof Bluesky_Embed_AspectRatioSchema
>;

export const Bluesky_Embed_AspectRatioSchema = z.object({
  $type: z.literal('app.bsky.embed.defs#aspectRatio').optional(),
  height: z.number(),
  width: z.number(),
});

export type Bluesky_Embed_ExternalViewExternal = z.infer<
  typeof Bluesky_Embed_ExternalViewExternalSchema
>;

export const Bluesky_Embed_ExternalViewExternalSchema = z.object({
  $type: z.literal('app.bsky.embed.external#viewExternal').optional(),
  description: z.string(),
  thumb: z.string().optional(),
  title: z.string(),
  uri: z.string(),
});

export type Bluesky_Embed_ExternalView = z.infer<
  typeof Bluesky_Embed_ExternalViewSchema
>;

export const Bluesky_Embed_ExternalViewSchema = z.object({
  $type: z.literal('app.bsky.embed.external#view'),
  external: Bluesky_Embed_ExternalViewExternalSchema,
});

export type Bluesky_Embed_ImageView = z.infer<
  typeof Bluesky_Embed_ImageViewSchema
>;

export const Bluesky_Embed_ImageViewSchema = z.object({
  $type: z.literal('app.bsky.embed.images#image').optional(),
  alt: z.string(),
  aspectRatio: Bluesky_Embed_AspectRatioSchema.optional(),
  fullsize: z.string(),
  thumb: z.string(),
});

export type Bluesky_Embed_ImagesView = z.infer<
  typeof Bluesky_Embed_ImagesViewSchema
>;

export const Bluesky_Embed_ImagesViewSchema = z.object({
  $type: z.literal('app.bsky.embed.images#view'),
  images: z.array(Bluesky_Embed_ImageViewSchema),
});

export type Bluesky_Embed_RecordViewBlockedPost = z.infer<
  typeof Bluesky_Embed_RecordViewBlockedPostSchema
>;

export const Bluesky_Embed_RecordViewBlockedPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewBlocked'),
  blocked: z.literal(true),
  uri: z.string(),
});

export type Bluesky_Embed_RecordViewDetachedPost = z.infer<
  typeof Bluesky_Embed_RecordViewDetachedPostSchema
>;

export const Bluesky_Embed_RecordViewDetachedPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewDetached'),
  detached: z.literal(true),
  uri: z.string(),
});

export type Bluesky_Embed_RecordViewNotFoundPost = z.infer<
  typeof Bluesky_Embed_RecordViewNotFoundPostSchema
>;

export const Bluesky_Embed_RecordViewNotFoundPostSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewNotFound'),
  notFound: z.literal(true),
  uri: z.string(),
});

export type Bluesky_Embed_VideoView = z.infer<
  typeof Bluesky_Embed_VideoViewSchema
>;

export const Bluesky_Embed_VideoViewSchema = z.object({
  $type: z.literal('app.bsky.embed.video#view'),
  aspectRatio: Bluesky_Embed_AspectRatioSchema.optional(),
  alt: z.string().optional(),
  cid: z.string(),
  playlist: z.string(),
  thumbnail: z.string().optional(),
});

export type Bluesky_Embed_RecordViewRecord = z.infer<
  typeof Bluesky_Embed_RecordViewRecordSchema
>;

export const Bluesky_Embed_RecordViewRecordSchema = z.object({
  $type: z.literal('app.bsky.embed.record#viewRecord').optional(),
  author: Bluesky_Actor_ProfileViewBasicSchema,
  cid: z.string(),
  embeds: z
    .array(
      z.discriminatedUnion('$type', [
        Bluesky_Embed_ImagesViewSchema,
        Bluesky_Embed_VideoViewSchema,
        Bluesky_Embed_ExternalViewSchema,
        // --- Infinite Recursion ---
        // Bluesky_Embed_RecordViewSchema,
        // Bluesky_Embed_RecordWithMediaViewSchema,
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

export type Bluesky_Embed_RecordView = z.infer<
  typeof Bluesky_Embed_RecordViewSchema
>;

export const Bluesky_Embed_RecordViewSchema = z.object({
  $type: z.literal('app.bsky.embed.record#view'),
  record: z.discriminatedUnion('$type', [
    Bluesky_Embed_RecordViewBlockedPostSchema,
    Bluesky_Embed_RecordViewDetachedPostSchema,
    Bluesky_Embed_RecordViewNotFoundPostSchema,
    Bluesky_Embed_RecordViewRecordSchema,
  ]),
});

export type Bluesky_Embed_RecordWithMediaView = z.infer<
  typeof Bluesky_Embed_RecordWithMediaViewSchema
>;

export const Bluesky_Embed_RecordWithMediaViewSchema = z.object({
  $type: z.literal('app.bsky.embed.recordWithMedia#view'),
  record: Bluesky_Embed_RecordViewSchema,
  media: z.discriminatedUnion('$type', [
    Bluesky_Embed_ImagesViewSchema,
    Bluesky_Embed_VideoViewSchema,
    Bluesky_Embed_ExternalViewSchema,
  ]),
});

export type Bluesky_Fee = z.infer<typeof Bluesky_Feed_Post>;

export const Bluesky_Feed_Post = z.object({
  $type: z.literal('app.bsky.feed.post').optional(),
  createdAt: z.string(),
  facets: z
    .array(
      z.object({
        features: z.array(
          z.object({
            $type: z.string(),
            did: z.string().optional(),
            tag: z.string().optional(),
            uri: z.string().optional(),
          }),
        ),
        index: z.object({ byteStart: z.number(), byteEnd: z.number() }),
      }),
    )
    .optional(),
  langs: z.array(z.string()).optional(),
  text: z.string(),
});

export type Bluesky_Feed_PostView = z.infer<typeof Bluesky_Feed_PostViewSchema>;

export const Bluesky_Feed_PostViewSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#postView').optional(),
  author: Bluesky_Actor_ProfileViewBasicSchema,
  cid: z.string(),
  embed: z
    .discriminatedUnion('$type', [
      Bluesky_Embed_ImagesViewSchema,
      Bluesky_Embed_VideoViewSchema,
      Bluesky_Embed_ExternalViewSchema,
      Bluesky_Embed_RecordViewSchema,
      Bluesky_Embed_RecordWithMediaViewSchema,
    ])
    .optional(),
  indexedAt: z.string(),
  labels: z.array(Bluesky_Label_LabelSchema).optional(),
  likeCount: z.number().optional(),
  quoteCount: z.number().optional(),
  record: Bluesky_Feed_Post,
  replyCount: z.number().optional(),
  repostCount: z.number().optional(),
  uri: z.string(),
});

export type Bluesky_Feed_BlockedPost = z.infer<
  typeof Bluesky_Feed_BlockedPostSchema
>;

export const Bluesky_Feed_BlockedPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#blockedPost'),
  blocked: z.literal(true),
  uri: z.string(),
});

export type Bluesky_Feed_NotFoundPost = z.infer<
  typeof Bluesky_Feed_NotFoundPostSchema
>;

export const Bluesky_Feed_NotFoundPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#notFoundPost'),
  notFound: z.literal(true),
  uri: z.string(),
});

export type Bluesky_Feed_Reply = z.infer<typeof Bluesky_Feed_ReplySchema>;

export const Bluesky_Feed_ReplySchema = z.object({
  $type: z.literal('app.bsky.feed.defs#replyRef').optional(),
  grandparentAuthor: Bluesky_Actor_ProfileViewBasicSchema.optional(),
  parent: z.discriminatedUnion('$type', [
    Bluesky_Feed_PostViewSchema,
    Bluesky_Feed_NotFoundPostSchema,
    Bluesky_Feed_BlockedPostSchema,
  ]),
  root: z.discriminatedUnion('$type', [
    Bluesky_Feed_PostViewSchema,
    Bluesky_Feed_NotFoundPostSchema,
    Bluesky_Feed_BlockedPostSchema,
  ]),
});

export type Bluesky_Feed_ReasonRepost = z.infer<
  typeof Bluesky_Feed_ReasonRepostSchema
>;

export const Bluesky_Feed_ReasonRepostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#reasonRepost'),
});

export type Bluesky_Feed_ReasonPin = z.infer<
  typeof Bluesky_Feed_ReasonPinSchema
>;

export const Bluesky_Feed_ReasonPinSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#reasonPin'),
});

export type Bluesky_Feed_ViewPost = z.infer<typeof Bluesky_Feed_ViewPostSchema>;

export const Bluesky_Feed_ViewPostSchema = z.object({
  $type: z.literal('app.bsky.feed.defs#feedViewPost').optional(),
  post: Bluesky_Feed_PostViewSchema,
  reason: z
    .discriminatedUnion('$type', [
      Bluesky_Feed_ReasonRepostSchema,
      Bluesky_Feed_ReasonPinSchema,
    ])
    .optional(),
  reply: Bluesky_Feed_ReplySchema.optional(),
});

export type Bluesky_API_AuthorFeed = z.infer<
  typeof Bluesky_API_AuthorFeedSchema
>;

export const Bluesky_API_AuthorFeedSchema = z.object({
  feed: z.array(Bluesky_Feed_ViewPostSchema),
  cursor: z.string().optional(),
});

export type Bluesky_UserList = z.infer<typeof Bluesky_UserListSchema>;

export const Bluesky_UserListSchema = z.object({
  cursor: z.string().optional(),
  subject: Bluesky_Actor_ProfileViewBasicSchema,
  users: z.array(Bluesky_Actor_ProfileViewBasicSchema),
});
