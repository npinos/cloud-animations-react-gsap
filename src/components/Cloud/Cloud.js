import React, { useEffect, useState } from 'react';
import gsap from "gsap";
    
class Particle {
          
  constructor(initX, initY, fill) {
    
    this.x = initX;
    this.y = initY;
    
    this.offset = 130 * Math.random();
    this.segment = 350;
    this.scale = 0.01;
    this.rotation = 0;
    this.alpha = gsap.utils.random(0.9, 1);
    this.fillStyle = fill;
    const duration = gsap.utils.random(3, 5);
    
    this.pathAnimation = gsap.timeline({repeat: -1});
    this.pathAnimation.to(this, { x: `+=${this.segment}`, duration: duration, ease: "sine.easeInOut" })
      .to(this, { x: `-=${this.segment}`, duration: duration, ease: "sine.easeInOut" });
    
    this.rotationAnimation = gsap.timeline({repeat: -1});
    this.rotationAnimation.to(this, { rotation: Math.PI * 2, duration: duration, ease: "sine.easeInOut" });
    
    this.scaleAnimation = gsap.timeline();
    this.scaleAnimation.to(this, { scale: 2.5, duration: duration, ease: "sine.easeInOut" });

    this.pathAnimation.time(gsap.utils.random(0,this.pathAnimation.duration()));
    this.rotationAnimation.time(gsap.utils.random(0,this.rotationAnimation.duration()));
  }
  
  draw(context) {
    const x = this.x + Math.cos(this.rotation) * this.offset;
    const y = this.y + Math.sin(this.rotation) * this.offset;
    context.translate(x, y);
    context.scale(this.scale, this.scale);
    context.globalAlpha = this.alpha;
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.ellipse(50, 50, 50, 50, 0, 0, Math.PI * 2, false);
    context.fill();
  }
}

const Cloud = props => {
  const [coordinates, setCoordinates] = useState(props.coordinates)
  const fillTuples = {blue: {cloud: '#00a0df', sky: '#FFFFFF'}, white: {cloud: '#EEEEEE', sky: '#00a0df'}};
  const [fill, setFill] = useState(fillTuples["white"]);
  let globalCanvas = null;
  let context = null;
  let particles = [];


  const buildParticles = (num, coordinates, fill) => {
    let particles = [];
    for (let i = 0; i < num; i++) {
      particles.push(new Particle(coordinates.x, coordinates.y, fill));
    }
    return particles;
  }

  const animateParticles = (canvas, context, particles) => {
    // Clear canvas for redrawing
    canvas.width += 0;
    particles.forEach(p => {
      context.save();
      p.draw(context);
      context.restore();
    });
  }

  const buildAnimation = () => {
    const canvas = globalCanvas;
    canvas.height = 600;
    canvas.width = 1100;
    context = globalCanvas.getContext("2d");
    particles = buildParticles(70, coordinates, fill.cloud);
    const animateHandler = () => {
        animateParticles(canvas, context, particles)
    }
    gsap.ticker.add(animateHandler);
  }

  useEffect(() => {
    buildAnimation();
  });

  return (
    <article className="sky" style={{backgroundColor: fill.sky}}>
      <canvas ref={ canvas => globalCanvas = canvas }></canvas>
      <section className="main-controls">
        <div className="field-wrapper">
          <select className="color-picker" 
            onChange={(e) => {
                setFill(fillTuples[e.target.value]);
              }}>
            <option defaultValue value="white">White</option>
            <option value="blue">Blue</option>
          </select>
        </div>
      </section>
    </article>
  );
}

export default Cloud;