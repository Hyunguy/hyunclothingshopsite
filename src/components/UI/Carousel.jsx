import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
function Arrow({onClick, direction, label}) {
  return <button type="button" className={'nft-carousel-arrow ' + direction} onClick={onClick} aria-label={(direction === 'prev' ? 'Previous ' : 'Next ') + label}><i aria-hidden="true" className={'fa fa-chevron-' + (direction === 'prev' ? 'left' : 'right')} /></button>;
}
export default function Carousel({children, label}) {
  return <div className="nft-carousel" aria-label={label}><Slider infinite slidesToShow={4} slidesToScroll={1} speed={400} prevArrow={<Arrow direction="prev" label={label}/>} nextArrow={<Arrow direction="next" label={label}/>} responsive={[
    {breakpoint: 1200, settings: {slidesToShow: 3}},
    {breakpoint: 992, settings: {slidesToShow: 2}},
    {breakpoint: 576, settings: {slidesToShow: 1}},
  ]}>{children}</Slider></div>;
}
