import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Slider({
  elements,
  visibleSlides = 1,
  styles = {},
  infinite = false,
  autoplaySpeed = false,
}) {
  const [offset, setOffset] = useState(0);
  const [autoplayDirection, setAutoplayDirection] = useState('right');

  const [userInteraction, setUserInteraction] = useState(false);
  const userInteractionRef = useRef(false);
  const interactionTimer = useRef(null);
  const slidesRef = [];
  const containerRef = useRef(null);

  const isMounted = useRef(true);

  const pauseAutoplay = () => {
    if (isMounted.current) {
      setUserInteraction(false);
      userInteractionRef.current = false;
    }
  };

  const markUserInteraction = () => {
    setUserInteraction(true);
    userInteractionRef.current = true;
    if (!interactionTimer.current) {
      interactionTimer.current = setTimeout(pauseAutoplay, 10000);
    } else {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = setTimeout(pauseAutoplay, 10000);
    }
  };

  const moveSlides = (direction) => {
    if (!isMounted.current) {
      return;
    }

    if (direction === 'left') {
      if (offset > 0) {
        const previousSlide = offset - 1;
        setOffset(previousSlide);
        const scrollTo = slidesRef[previousSlide].offsetLeft;
        containerRef.current.scroll(scrollTo, 0);
      } else if (infinite && offset === 0) {
        const scrollTo = slidesRef[elements.length - visibleSlides].offsetLeft;
        containerRef.current.scroll(scrollTo, 0);
        setOffset(elements.length - visibleSlides);
      }
    } else if (direction === 'right') {
      if (offset + visibleSlides < elements.length) {
        const nextSlide = offset + 1;
        const scrollTo = slidesRef[nextSlide].offsetLeft;
        setOffset(nextSlide);
        containerRef.current.scroll(scrollTo, 0);
      } else if ((infinite) && (offset + visibleSlides === elements.length)) {
        const scrollTo = slidesRef[0].offsetLeft;
        containerRef.current.scroll(scrollTo, 0);
        setOffset(0);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (autoplaySpeed && isMounted.current) {
      if (offset === 0) {
        setAutoplayDirection('right');
      } else if (offset + visibleSlides === elements.length) {
        setAutoplayDirection('left');
      }

      setTimeout(() => {
        if (!userInteractionRef.current) {
          if (infinite) {
            moveSlides('right');
          } else {
            moveSlides(autoplayDirection);
          }
        }
      }, autoplaySpeed);
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, autoplayDirection, userInteraction]);

  const slides = elements.map((slide, i) => (
    <div
      className={styles.slide}
      // eslint-disable-next-line react/no-array-index-key
      key={`slide_${i}`}
      ref={(ref) => (slidesRef.push(ref))}
    >
      {slide}
    </div>
  ));

  return (
    <div className="w-full">
      <div className={styles.container} style={{ scrollBehavior: 'smooth' }} ref={containerRef}>
        {slides}
      </div>
      <div
        onKeyPress={() => { markUserInteraction(); moveSlides('left'); }}
        onClick={() => { markUserInteraction(); moveSlides('left'); }}
        className={`${styles.previousButton}`}
        role="button"
        tabIndex={0}
        aria-label="previousButton"

      >
        <ArrowBackIcon alt="slider left" />
      </div>
      <div
        onKeyPress={() => { markUserInteraction(); moveSlides('right'); }}
        onClick={() => { markUserInteraction(); moveSlides('right'); }}
        className={`${styles.nextButton}`}
        role="button"
        tabIndex={0}
        aria-label="nextButton"
      >
        <ArrowForwardIcon alt="slider right" />
      </div>
    </div>
  );
}

Slider.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.node).isRequired,
  visibleSlides: PropTypes.number,
  styles: PropTypes.objectOf(PropTypes.string),
  infinite: PropTypes.bool,
  autoplaySpeed: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};

Slider.defaultProps = {
  visibleSlides: 1,
  styles: {},
  infinite: false,
  autoplaySpeed: false,
};
