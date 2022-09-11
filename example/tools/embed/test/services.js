import { expect } from 'chai';

import EmbedTool from '../src/index';

EmbedTool.prepare({});
const { patterns } = EmbedTool.pasteConfig;
const embed = new EmbedTool({ data: {} });

const composePasteEventMock = (type, service, url) => ({
  type,
  detail: {
    key: service,
    data: url
  }
});

describe('Services Regexps', () => {
  it('YouTube', async () => {
    const service = 'youtube';

    const urls = [
      { source: 'https://www.youtube.com/watch?v=wZZ7oFKsKzY&t=120', embed: 'https://www.youtube.com/embed/wZZ7oFKsKzY?start=120' },
      { source: 'https://www.youtube.com/embed/_q51LZ2HpbE?list=PLLy6qvPKpdlV3OAw00EuZMoYPz4pYuwuN', embed: 'https://www.youtube.com/embed/_q51LZ2HpbE?list=PLLy6qvPKpdlV3OAw00EuZMoYPz4pYuwuN' },
      { source: 'https://www.youtube.com/watch?time_continue=173&v=Nd9LbCWpHp8', embed: 'https://www.youtube.com/embed/Nd9LbCWpHp8?start=173' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Vimeo', async () => {
    const service = 'vimeo';

    const urls = [
      { source: 'https://vimeo.com/289836809', embed: 'https://player.vimeo.com/video/289836809?title=0&byline=0' },
      { source: 'https://www.vimeo.com/280712228', embed: 'https://player.vimeo.com/video/280712228?title=0&byline=0' },
      { source: 'https://player.vimeo.com/video/504749530', embed: 'https://player.vimeo.com/video/504749530?title=0&byline=0' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Coub', async () => {
    const service = 'coub';

    const urls = [
      { source: 'https://coub.com/view/1efrxs', embed: 'https://coub.com/embed/1efrxs' },
      { source: 'https://coub.com/view/1c6nrr', embed: 'https://coub.com/embed/1c6nrr' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;
      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Imgur', async () => {
    const service = 'imgur';

    const urls = [
      { source: 'https://imgur.com/gallery/OHbkxgr', embed: 'http://imgur.com/OHbkxgr/embed' },
      { source: 'https://imgur.com/gallery/TqIWG12', embed: 'http://imgur.com/TqIWG12/embed' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Gfycat', async () => {
    const service = 'gfycat';

    const urls = [
      { source: 'https://gfycat.com/EsteemedMarvelousHagfish', embed: 'https://gfycat.com/ifr/EsteemedMarvelousHagfish' },
      { source: 'https://gfycat.com/OddCornyLeech', embed: 'https://gfycat.com/ifr/OddCornyLeech' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;
      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Twitch channel', async () => {
    const service = 'twitch-channel';

    const urls = [
      { source: 'https://www.twitch.tv/ninja', embed: 'https://player.twitch.tv/?channel=ninja' },
      { source: 'https://www.twitch.tv/gohamedia', embed: 'https://player.twitch.tv/?channel=gohamedia' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;
      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Twitch video', async () => {
    const service = 'twitch-video';

    const urls = [
      { source: 'https://www.twitch.tv/videos/315468440', embed: 'https://player.twitch.tv/?video=v315468440' },
      { source: 'https://www.twitch.tv/videos/314691366', embed: 'https://player.twitch.tv/?video=v314691366' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Yandex Music album', async () => {
    const service = 'yandex-music-album';

    const urls = [
      { source: 'https://music.yandex.ru/album/5643859', embed: 'https://music.yandex.ru/iframe/#album/5643859/' },
      { source: 'https://music.yandex.ru/album/5393158', embed: 'https://music.yandex.ru/iframe/#album/5393158/' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Yandex Music track', async () => {
    const service = 'yandex-music-track';

    const urls = [
      { source: 'https://music.yandex.ru/album/5643859/track/42662275', embed: 'https://music.yandex.ru/iframe/#track/5643859/42662275/' },
      { source: 'https://music.yandex.ru/album/5393158/track/41249158', embed: 'https://music.yandex.ru/iframe/#track/5393158/41249158/' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Yandex Music playlist', async () => {
    const service = 'yandex-music-playlist';

    const urls = [
      { source: 'https://music.yandex.ru/users/yamusic-personal/playlists/25098905', embed: 'https://music.yandex.ru/iframe/#playlist/yamusic-personal/25098905/show/cover/description/' },
      { source: 'https://music.yandex.ru/users/yamusic-personal/playlists/27924603', embed: 'https://music.yandex.ru/iframe/#playlist/yamusic-personal/27924603/show/cover/description/' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;
      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Codepen', async () => {
    const service = 'codepen';

    const urls = [
      { source: 'https://codepen.io/Rikkokiri/pen/RYBrwG', embed: 'https://codepen.io/Rikkokiri/embed/RYBrwG?height=300&theme-id=0&default-tab=css,result&embed-version=2' },
      { source: 'https://codepen.io/geoffgraham/pen/bxEVEN', embed: 'https://codepen.io/geoffgraham/embed/bxEVEN?height=300&theme-id=0&default-tab=css,result&embed-version=2' }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Twitter', async () => {
    const service = 'twitter';

    const urls = [
      {
        source: 'https://twitter.com/codex_team/status/1202295536826630145',
        embed: 'https://twitframe.com/show?url=https://twitter.com/codex_team/status/1202295536826630145'
      },
      {
        source: 'https://twitter.com/codex_team/status/1202295536826630145?s=20&t=wrY8ei5GBjbbmNonrEm2kQ',
        embed: 'https://twitframe.com/show?url=https://twitter.com/codex_team/status/1202295536826630145?s=20&t=wrY8ei5GBjbbmNonrEm2kQ'
      },
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Instagram', async () => {
    const service = 'instagram';

    const urls = [
      {
        source: 'https://www.instagram.com/p/B--iRCFHVxI/',
        embed: 'https://www.instagram.com/p/B--iRCFHVxI/embed'
      },
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });
  it('Aparat', async () => {
    const service = 'aparat';
    const urls = [
      {
        source: 'https://www.aparat.com/v/tDZe5',
        embed: 'https://www.aparat.com/video/video/embed/videohash/tDZe5/vt/frame'
      },
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Patterns', async () => {
    const services = {
      youtube: 'https://www.youtube.com/watch?v=wZZ7oFKsKzY',
      vimeo: 'https://vimeo.com/289836809',
      coub: 'https://coub.com/view/1efrxs',
      imgur: 'https://imgur.com/gallery/OHbkxgr',
      gfycat: 'https://gfycat.com/EsteemedMarvelousHagfish',
      'twitch-channel': 'https://www.twitch.tv/ninja',
      'twitch-video': 'https://www.twitch.tv/videos/315468440',
      'yandex-music-album': 'https://music.yandex.ru/album/5643859',
      'yandex-music-track': 'https://music.yandex.ru/album/5643859/track/42662275',
      'yandex-music-playlist': 'https://music.yandex.ru/users/yamusic-personal/playlists/25098905',
      'codepen': 'https://codepen.io/Rikkokiri/pen/RYBrwG'
    };

    Object
      .entries(services)
      .forEach(([name, url]) => {
        const foundService = Object.entries(patterns).find(([key, pattern]) => {
          return pattern.test(url);
        });

        expect(foundService[0]).to.be.equal(name);
      });
  });


  it('Pinterest', async () => {
    const service = 'pinterest';

    const urls = [
      {
        source: 'https://tr.pinterest.com/pin/409757266103637553/',
        embed: 'https://assets.pinterest.com/ext/embed.html?id=409757266103637553'
      },
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

  it('Facebook', async () => {
    const service = 'facebook';

    const urls = [
      {
        source: 'https://www.facebook.com/genclikforeverresmi/videos/944647522284479',
        embed: 'https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/genclikforeverresmi/videos/944647522284479&width=500'
      },
      {
        source:'https://www.facebook.com/0devco/posts/497515624410920',
        embed: 'https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/0devco/posts/497515624410920&width=500'
      }
    ];

    urls.forEach(url => {
      expect(patterns[service].test(url.source)).to.be.true;

      const event = composePasteEventMock('pattern', service, url.source);

      embed.onPaste(event);

      expect(embed.data.service).to.be.equal(service);
      expect(embed.data.embed).to.be.equal(url.embed);
      expect(embed.data.source).to.be.equal(url.source);
    });
  });

});

describe('Miro service', () => {
  it('should correctly parse URL got from a browser', () => {
    const regularBoardUrl = 'https://miro.com/app/board/10J_kw57KxQ=/';
    const event = composePasteEventMock('pattern', 'miro', regularBoardUrl);

    embed.onPaste(event);

    expect(patterns.miro.test(regularBoardUrl)).to.be.true;
    expect(embed.data.service).to.be.equal('miro');
    expect(embed.data.embed).to.be.equal('https://miro.com/app/live-embed/10J_kw57KxQ=');
    expect(embed.data.source).to.be.equal(regularBoardUrl);
  })
});

