import PropTypes from 'prop-types';

export default function YouTubeEmbed({ title, url, id }) {
  return (
    <div className="video-responsive h-60">
      <iframe
        title={title}
        width="100%"
        height="100%"
        src={url}
        key={id}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

YouTubeEmbed.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
