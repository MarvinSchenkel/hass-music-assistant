/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type Connection,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  getAuth,
} from "home-assistant-js-websocket";
import { reactive, ref } from "vue";

export enum MediaType {
  ARTIST = "artist",
  ALBUM = "album",
  TRACK = "track",
  PLAYLIST = "playlist",
  RADIO = "radio",
  FOLDER = "folder",
  UNKNOWN = "unknown",
}

export enum MediaQuality {
  UNKNOWN = 0,
  LOSSY_MP3 = 1,
  LOSSY_OGG = 2,
  LOSSY_AAC = 3,
  LOSSLESS = 10, // 44.1/48khz 16 bits
  LOSSLESS_HI_RES_1 = 20, // 44.1/48khz 24 bits HI-RES
  LOSSLESS_HI_RES_2 = 21, // 88.2/96khz 24 bits HI-RES
  LOSSLESS_HI_RES_3 = 22, // 176/192khz 24 bits HI-RES
  LOSSLESS_HI_RES_4 = 23, // above 192khz 24 bits HI-RES
}

export enum ProviderType {
  FILESYSTEM_LOCAL = "file",
  FILESYSTEM_SMB = "smb",
  FILESYSTEM_GOOGLE_DRIVE = "gdrive",
  FILESYSTEM_ONEDRIVE = "onedrive",
  SPOTIFY = "spotify",
  QOBUZ = "qobuz",
  TUNEIN = "tunein",
  YTMUSIC = "ytmusic",
  DATABASE = "database",
  URL = "url",
}
export interface MediaItemProviderId {
  item_id: string;
  prov_type: ProviderType;
  prov_id: string;
  available: boolean;
  quality?: MediaQuality;
  details?: string;
  url?: string;
}

export enum LinkType {
  WEBSITE = "website",
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  LASTFM = "lastfm",
  YOUTUBE = "youtube",
  INSTAGRAM = "instagram",
  SNAPCHAT = "snapchat",
  TIKTOK = "tiktok",
  DISCOGS = "discogs",
  WIKIPEDIA = "wikipedia",
  ALLMUSIC = "allmusic",
}

export enum ImageType {
  THUMB = "thumb",
  WIDE_THUMB = "wide_thumb",
  FANART = "fanart",
  LOGO = "logo",
  CLEARART = "clearart",
  BANNER = "banner",
  CUTOUT = "cutout",
  BACK = "back",
  CDART = "cdart",
  EMBEDDED_THUMB = "embedded_thumb",
  OTHER = "other",
}

export interface MediaItemLink {
  type: LinkType;
  url: string;
}

export interface MediaItemImage {
  type: ImageType;
  url: string;
  is_file: boolean;
}

export interface MediaItemMetadata {
  description?: string;
  review?: string;
  explicit?: boolean;
  images?: MediaItemImage[];
  genres?: string[];
  mood?: string;
  style?: string;
  copyright?: string;
  lyrics?: string;
  label?: string;
  links?: MediaItemLink[];
  performers?: string[];
  preview?: string;
  replaygain?: number;
  popularity?: number;
}

export interface ItemMapping {
  item_id: string;
  provider: ProviderType;
  name: string;
  media_type: MediaType;
  uri: string;
}

export interface MediaItem {
  item_id: string;
  provider: ProviderType;
  name: string;
  sort_name?: string;
  metadata: MediaItemMetadata;
  provider_ids: MediaItemProviderId[];
  in_library: boolean;
  media_type: MediaType;
  uri: string;
  timestamp: number;
}

export interface Artist extends MediaItem {
  musicbrainz_id: string;
}

export enum AlbumType {
  ALBUM = "album",
  SINGLE = "single",
  COMPILATION = "compilation",
  UNKNOWN = "unknown",
}

export interface Album extends MediaItem {
  version: string;
  year?: number;
  artist: ItemMapping | Artist;
  album_type: AlbumType;
  upc?: string;
  musicbrainz_id?: string;
}

export interface Track extends MediaItem {
  duration: number;
  version: string;
  isrc: string;
  musicbrainz_id?: string;
  artists: Array<ItemMapping | Artist>;
  // album track only
  album: ItemMapping | Album;
  disc_number?: number;
  track_number?: number;
  // playlist track only
  position?: number;
}

export interface Playlist extends MediaItem {
  owner: string;
  checksum: string;
  is_editable: boolean;
}

export interface Radio extends MediaItem {
  duration?: number;
}

export interface BrowseFolder extends MediaItem {
  label: string;
  items?: MediaItemType[];
}

export type MediaItemType =
  | Artist
  | Album
  | Track
  | Playlist
  | Radio
  | BrowseFolder;

export enum StreamType {
  EXECUTABLE = "executable",
  URL = "url",
  FILE = "file",
  CACHE = "cache",
}

export enum ContentType {
  OGG = "ogg",
  FLAC = "flac",
  MP3 = "mp3",
  AAC = "aac",
  MPEG = "mpeg",
  WAV = "wav",
  PCM_S16LE = "s16le", // PCM signed 16-bit little-endian
  PCM_S24LE = "s24le", // PCM signed 24-bit little-endian
  PCM_S32LE = "s32le", // PCM signed 32-bit little-endian
  PCM_F32LE = "f32le", // PCM 32-bit floating-point little-endian
  PCM_F64LE = "f64le,", // PCM 64-bit floating-point little-endian
}

export interface StreamDetails {
  provider: ProviderType;
  item_id: string;
  content_type: ContentType;
  media_type: MediaType;
  sample_rate: number;
  bit_depth: number;
  channels: number;
  stream_title?: string;
  duration?: number;
  size?: number;
  queue_id?: string;
  seconds_streamed: number;
  seconds_skipped: number;
  gain_correct: number;
  loudness?: number;
}

export enum PlayerState {
  IDLE = "idle",
  PAUSED = "paused",
  PLAYING = "playing",
  OFF = "off",
}

export interface DeviceInfo {
  model: string;
  address: string;
  manufacturer: string;
}

export interface Player {
  player_id: string;
  name: string;
  powered: boolean;
  elapsed_time: number;
  state: PlayerState;
  available: boolean;
  volume_level: number;
  is_group: boolean;
  group_members: string[];
  is_passive: boolean;
  group_name: string;
  group_powered: boolean;
  group_volume_level: number;
  device_info: DeviceInfo;
  active_queue: string;
}

export interface QueueItem {
  uri: string;
  name: string;
  duration: number;
  item_id: string;
  sort_index: number;
  streamdetails?: StreamDetails;
  media_type: MediaType;
  image?: string;
  available?: boolean;
  media_item?: Track | Radio;
}

export enum CrossFadeMode {
  DISABLED = "disabled", // no crossfading at all
  STRICT = "strict", // do not crossfade tracks of same album
  SMART = "smart", // crossfade if possible (do not crossfade different sample rates)
  ALWAYS = "always", // all tracks - resample to fixed sample rate
}

export enum RepeatMode {
  OFF = "off", // no repeat at all
  ONE = "one", // repeat current/single track
  ALL = "all", // repeat entire queue
}

export interface QueueSettings {
  repeat_mode: RepeatMode;
  shuffle_enabled: boolean;
  crossfade_mode: CrossFadeMode;
  crossfade_duration: number;
  volume_normalization_enabled: boolean;
  volume_normalization_target: number;
}

export type QueueSettingsUpdate = Partial<QueueSettings>;

export interface PlayerQueue {
  queue_id: string;
  player: string;
  name: string;
  active: string;
  elapsed_time: number;
  state: PlayerState;
  available: boolean;
  current_index?: number;
  index_in_buffer?: number;
  current_item?: QueueItem;
  next_item?: QueueItem;
  items: number;
  settings: QueueSettings;
}

export enum QueueCommand {
  PLAY = "play",
  PAUSE = "pause",
  PLAY_PAUSE = "play_pause",
  NEXT = "next",
  PREVIOUS = "previous",
  STOP = "stop",
  SEEK = "seek",
  SKIP_AHEAD = "skip_ahead",
  SKIP_BACK = "skip_back",
  POWER = "power",
  POWER_TOGGLE = "power_toggle",
  VOLUME = "volume",
  VOLUME_UP = "volume_up",
  VOLUME_DOWN = "volume_down",
  CLEAR = "clear",
  PLAY_INDEX = "play_index",
  MOVE_UP = "move_up",
  MOVE_DOWN = "move_down",
  MOVE_NEXT = "move_next",
  DELETE = "delete",
  GROUP_POWER = "group_power",
  GROUP_VOLUME = "group_volume",
}

export enum MassEventType {
  PLAYER_ADDED = "player_added",
  PLAYER_UPDATED = "player_updated",
  STREAM_STARTED = "streaming_started",
  STREAM_ENDED = "streaming_ended",
  QUEUE_ADDED = "queue_added",
  QUEUE_UPDATED = "queue_updated",
  QUEUE_ITEMS_UPDATED = "queue_items_updated",
  QUEUE_TIME_UPDATED = "queue_time_updated",
  SHUTDOWN = "application_shutdown",
  BACKGROUND_JOB_UPDATED = "background_job_updated",
  // special types for local subscriptions only
  ALL = "*",
}

export enum QueueOption {
  PLAY = "play",
  REPLACE = "replace",
  NEXT = "next",
  ADD = "add",
}

export type MassEvent = {
  event: MassEventType;
  object_id?: string;
  data?: Record<string, any>;
};

export enum JobStatus {
  PENDING = "pending",
  RUNNING = "running",
  CANCELLED = "cancelled",
  FINISHED = "success",
  ERROR = "error",
}

export type BackgroundJob = {
  id: string;
  name: string;
  timestamp: number;
  status: JobStatus;
};

export interface MusicProvider {
  type: ProviderType;
  name: string;
  id: string;
  supported_mediatypes: MediaType[];
}

export interface Library {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  radios: Radio[];
  playlists: Playlist[];
  artistsFetched: boolean;
  albumsFetched: boolean;
  tracksFetched: boolean;
  radiosFetched: boolean;
  playlistsFetched: boolean;
}

export interface LibraryCount {
  artists: number;
  albums: number;
  tracks: number;
  playlists: number;
  radios: number;
}

export interface Stats {
  providers: { [provider_id: string]: MusicProvider };
  db_count: LibraryCount;
  library_count: LibraryCount;
}

export class MusicAssistantApi {
  // eslint-disable-next-line prettier/prettier
  private _conn?: Connection;
  private _lastId: number;
  private _initialized: boolean;
  private _throttleId?: any;
  public players = reactive<{ [player_id: string]: Player }>({});
  public queues = reactive<{ [queue_id: string]: PlayerQueue }>({});
  public stats = reactive<Stats>({
    providers: {},
    db_count: { artists: 0, albums: 0, tracks: 0, playlists: 0, radios: 0 },
    library_count: {
      artists: 0,
      albums: 0,
      tracks: 0,
      playlists: 0,
      radios: 0,
    },
  });
  public jobs = ref<BackgroundJob[]>([]);
  private _wsEventCallbacks: Array<[string, CallableFunction]>;

  constructor(conn?: Connection) {
    this._initialized = false;
    this._conn = conn;
    this._lastId = 0;
    this._wsEventCallbacks = [];
  }

  public get initialized() {
    return this._initialized;
  }

  public async initialize(conn?: Connection) {
    if (conn) this._conn = conn;
    else if (!this._conn) {
      this._conn = await this.connectHassStandalone();
    }
    this._initialized = true;

    // load initial data from api
    this._fetchState();
    // subscribe to mass events
    this._conn?.subscribeMessage(
      (msg: MassEvent) => {
        this.handleMassEvent(msg);
      },
      {
        type: "mass/subscribe",
      }
    );
  }

  public subscribe(eventFilter: MassEventType, callback: CallableFunction) {
    // subscribe a listener for events
    // returns handle to remove the listener
    const listener: [MassEventType, CallableFunction] = [eventFilter, callback];
    this._wsEventCallbacks.push(listener);
    const removeCallback = () => {
      const index = this._wsEventCallbacks.indexOf(listener);
      if (index > -1) {
        this._wsEventCallbacks.splice(index, 1);
      }
    };
    return removeCallback;
  }

  private async _fetchState() {
    // fetch full initial state
    for (const player of await this.getPlayers()) {
      this.players[player.player_id] = player;
    }
    for (const queue of await this.getPlayerQueues()) {
      this.queues[queue.queue_id] = queue;
    }

    const stats = await this.getData<Stats>("stats");
    Object.assign(this.stats, stats);
    console.log("stats", stats);

    this.jobs.value = await this.getData("jobs");
  }

  public getTracks(
    offset?: number,
    limit?: number,
    sort?: string,
    library?: boolean,
    search?: string
  ): Promise<Track[]> {
    return this.getData("tracks", { offset, limit, sort, library, search });
  }

  public getTrack(
    provider: ProviderType,
    item_id: string,
    lazy = true,
    refresh = false
  ): Promise<Track> {
    return this.getData("track", { provider, item_id, lazy, refresh });
  }

  public getTrackVersions(
    provider: ProviderType,
    item_id: string,
  ): Promise<Track[]> {
    return this.getData("track/versions", { provider, item_id });
  }

  public getTrackPreviewUrl(
    provider: ProviderType,
    item_id: string
  ): Promise<string> {
    return this.getData("track/preview", {
      provider,
      item_id,
    });
  }

  public getArtists(
    offset?: number,
    limit?: number,
    sort?: string,
    library?: boolean,
    search?: string
  ): Promise<Artist[]> {
    return this.getData("artists", { offset, sort, limit, library, search });
  }

  public getArtist(
    provider: ProviderType,
    item_id: string,
    lazy = true,
    refresh = false
  ): Promise<Artist> {
    return this.getData("artist", { provider, item_id, lazy, refresh });
  }

  public getArtistTracks(
    provider: ProviderType,
    item_id: string,
  ): Promise<Track[]> {
    return this.getData("artist/tracks", { provider, item_id });
  }

  public getArtistAlbums(
    provider: ProviderType,
    item_id: string,
  ): Promise<Album[]> {
    return this.getData("artist/albums", { provider, item_id });
  }

  public getAlbums(
    offset?: number,
    limit?: number,
    sort?: string,
    library?: boolean,
    search?: string
  ): Promise<Album[]> {
    return this.getData("albums", { offset, limit, sort, library, search });
  }

  public getAlbum(
    provider: ProviderType,
    item_id: string,
    lazy = true,
    refresh = false
  ): Promise<Album> {
    return this.getData("album", { provider, item_id, lazy, refresh });
  }

  public getAlbumTracks(
    provider: ProviderType,
    item_id: string,
  ): Promise<Track[]> {
    return this.getData("album/tracks", { provider, item_id });
  }

  public getAlbumVersions(
    provider: ProviderType,
    item_id: string,
  ): Promise<Album[]> {
    return this.getData("album/versions", { provider, item_id });
  }

  public getPlaylists(
    offset?: number,
    limit?: number,
    sort?: string,
    library?: boolean,
    search?: string
  ): Promise<Playlist[]> {
    return this.getData("playlists", { offset, limit, sort, library, search });
  }

  public getPlaylist(
    provider: ProviderType,
    item_id: string,
    lazy = true,
    refresh = false
  ): Promise<Playlist> {
    return this.getData("playlist", { provider, item_id, lazy, refresh });
  }

  public getPlaylistTracks(
    provider: ProviderType,
    item_id: string,
  ): Promise<Track[]> {
    return this.getData("playlist/tracks", { provider, item_id });
  }

  public addPlaylistTracks(item_id: string, uri: string | string[]) {
    this.executeCmd("playlist/tracks/add", { item_id, uri });
  }

  public removePlaylistTracks(item_id: string, position: number | number[]) {
    this.executeCmd("playlist/tracks/remove", { item_id, position });
  }

  public getRadios(
    offset?: number,
    limit?: number,
    sort?: string,
    library?: boolean,
    search?: string
  ): Promise<Radio[]> {
    return this.getData("radios", { offset, limit, sort, library, search });
  }

  public getRadio(
    provider: ProviderType,
    item_id: string,
    lazy = true,
    refresh = false
  ): Promise<Radio> {
    return this.getData("radio", { provider, item_id, lazy, refresh });
  }

  public getItem(
    uri: string,
    lazy = true,
    refresh = false
  ): Promise<MediaItemType> {
    return this.getData("item", { uri, lazy, refresh });
  }

  public async addToLibrary(items: MediaItemType[]) {
    for (const x of items) {
      x.in_library = true;
      this.executeCmd("library/add", { uri: x.uri });
    }
  }
  public async removeFromLibrary(items: MediaItemType[]) {
    for (const x of items) {
      x.in_library = false;
      this.executeCmd("library/remove", { uri: x.uri });
    }
  }
  public async toggleLibrary(item: MediaItemType) {
    if (item.in_library) return await this.removeFromLibrary([item]);
    return await this.addToLibrary([item]);
  }

  public browse(uri?: string): Promise<Track[]> {
    return this.getData("browse", { uri });
  }

  public search(query: string): Promise<Track[]> {
    return this.getData("search", { query });
  }

  public async getPlayers(): Promise<Player[]> {
    return this.getData("players");
  }

  public async getPlayerQueues(): Promise<PlayerQueue[]> {
    return this.getData("playerqueues");
  }

  public async getPlayerQueueItems(queue_id: string): Promise<QueueItem[]> {
    return this.getData("playerqueue/items", { queue_id });
  }

  public queueCommandPlay(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.PLAY);
  }
  public queueCommandPause(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.PAUSE);
  }
  public queueCommandPlayPause(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.PLAY_PAUSE);
  }
  public queueCommandStop(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.STOP);
  }
  public queueCommandPowerToggle(queueId: string) {
    this.playerQueueCommand(
      queueId,
      QueueCommand.POWER,
      !this.players[queueId].powered
    );
  }
  public queueCommandNext(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.NEXT);
  }
  public queueCommandPrevious(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.PREVIOUS);
  }

  public queueCommandVolume(queueId: string, newVolume: number) {
    this.playerQueueCommand(queueId, QueueCommand.VOLUME, newVolume);
    this.players[queueId].volume_level = newVolume;
  }
  public queueCommandVolumeUp(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.VOLUME_UP);
  }
  public queueCommandVolumeDown(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.VOLUME_DOWN);
  }
  public queueCommandClear(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.CLEAR);
  }
  public queueCommandPlayIndex(queueId: string, index: number | string) {
    this.playerQueueCommand(queueId, QueueCommand.PLAY_INDEX, index);
  }
  public queueCommandMoveUp(queueId: string, itemId: string) {
    this.playerQueueCommand(queueId, QueueCommand.MOVE_UP, itemId);
  }
  public queueCommandMoveDown(queueId: string, itemId: string) {
    this.playerQueueCommand(queueId, QueueCommand.MOVE_DOWN, itemId);
  }
  public queueCommandMoveNext(queueId: string, itemId: string) {
    this.playerQueueCommand(queueId, QueueCommand.MOVE_NEXT, itemId);
  }
  public queueCommandDelete(queueId: string, itemId: string) {
    this.playerQueueCommand(queueId, QueueCommand.DELETE, itemId);
  }

  public queueCommandSeek(queueId: string, position: number) {
    this.playerQueueCommand(queueId, QueueCommand.SEEK, position);
  }
  public queueCommandSkipAhead(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.SKIP_AHEAD);
  }
  public queueCommandSkipBack(queueId: string) {
    this.playerQueueCommand(queueId, QueueCommand.SKIP_BACK);
  }

  public queueCommandGroupVolume(queueId: string, newVolume: number) {
    this.playerQueueCommand(queueId, QueueCommand.GROUP_VOLUME, newVolume);
    this.players[queueId].group_volume_level = newVolume;
  }
  public queueCommandGroupPower(queueId: string, newPower: boolean) {
    this.playerQueueCommand(queueId, QueueCommand.GROUP_POWER, newPower);
    this.players[queueId].group_powered = newPower;
  }

  public playerQueueCommand(
    queue_id: string,
    command: QueueCommand,
    command_arg?: boolean | number | string
  ) {
    // apply a bit of throttling here (for the volume and seek sliders especially)
    clearTimeout(this._throttleId);
    this._throttleId = setTimeout(() => {
      this.executeCmd("playerqueue/command", {
        queue_id,
        command,
        command_arg,
      });
    }, 200);
  }

  public playerQueueSettings(queueId: string, settings: QueueSettingsUpdate) {
    this.executeCmd("playerqueue/settings", { queue_id: queueId, settings });
  }

  public playMedia(
    queue_id: string,
    media: string | string[] | MediaItemType | MediaItemType[],
    command: QueueOption = QueueOption.PLAY
  ) {
    this.executeCmd("play_media", { queue_id, command, media });
  }

  public startSync(media_type?: MediaType, prov_type?: ProviderType) {
    this.executeCmd("start_sync", { media_type, prov_type });
  }

  public getLocalThumb(path: string, size?: number): Promise<string> {
    return this.getData("thumb", { path, size });
  }

  private async connectHassStandalone() {
    let auth;
    const storeAuth = true;
    const authOptions = storeAuth
      ? {
          async loadTokens() {
            try {
              return JSON.parse(localStorage.hassTokens);
            } catch (err) {
              return undefined;
            }
          },
          saveTokens: (tokens) => {
            localStorage.hassTokens = JSON.stringify(tokens);
          },
        }
      : {};
    try {
      auth = await getAuth(authOptions);
    } catch (err) {
      if (err === ERR_HASS_HOST_REQUIRED) {
        authOptions.hassUrl = prompt(
          "What host to connect to?",
          "http://localhost:8123"
        );
        if (!authOptions.hassUrl) return;
        auth = await getAuth(authOptions);
      } else {
        alert(`Unknown error: ${err}`);
        return;
      }
    }
    const connection = await createConnection({ auth });
    connection.addEventListener("ready", () => window.history.back());
    return connection;
  }

  private handleMassEvent(msg: MassEvent) {
    if (msg.event == MassEventType.QUEUE_ADDED) {
      const queue = msg.data as PlayerQueue;
      this.queues[queue.queue_id] = queue;
    } else if (msg.event == MassEventType.QUEUE_UPDATED) {
      const queue = msg.data as PlayerQueue;
      if (queue.queue_id in this.queues)
        Object.assign(this.queues[queue.queue_id], queue);
      else this.queues[queue.queue_id] = queue;
    } else if (msg.event == MassEventType.QUEUE_TIME_UPDATED) {
      const queueId = msg.object_id as string;
      if (queueId in this.queues)
        this.queues[queueId].elapsed_time = msg.data as unknown as number;
    } else if (msg.event == MassEventType.PLAYER_ADDED) {
      const player = msg.data as Player;
      this.players[player.player_id] = player;
    } else if (msg.event == MassEventType.PLAYER_UPDATED) {
      const player = msg.data as Player;
      if (player.player_id in this.players)
        Object.assign(this.players[player.player_id], player);
      else this.players[player.player_id] = player;
    } else if (msg.event == MassEventType.BACKGROUND_JOB_UPDATED) {
      this.jobs.value = this.jobs.value.filter(
        (x) => x.id !== msg.data?.id && x.status !== JobStatus.FINISHED
      );
      this.jobs.value.push(msg.data as BackgroundJob);
    }
    // signal + log all events
    this.signalEvent(msg);
    if (msg.event !== MassEventType.QUEUE_TIME_UPDATED) {
      console.log("[event]", msg);
    }
  }

  private signalEvent(msg: MassEvent) {
    // signal event to all listeners
    for (const listener of this._wsEventCallbacks) {
      if (listener[0] === MassEventType.ALL || listener[0] === msg.event) {
        listener[1](msg);
      }
    }
  }

  private getData<T>(endpoint: string, args?: Record<string, any>): Promise<T> {
    this._lastId++;
    console.log(`[getData] ${endpoint}`, args || "");
    return (this._conn as Connection).sendMessagePromise({
      id: this._lastId,
      type: `mass/${endpoint}`,
      ...args,
    });
  }

  private executeCmd(endpoint: string, args?: Record<string, any>) {
    this._lastId++;
    console.log(`[executeCmd] ${endpoint}`, args || "");
    (this._conn as Connection).sendMessage({
      id: this._lastId,
      type: `mass/${endpoint}`,
      ...args,
    });
  }
}

export const api = new MusicAssistantApi();
export default api;
