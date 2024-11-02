import { useEffect, useRef } from "react";
import "./SunMovement.css";

export default function SunMovement({ weather, is24HourFormat }) {
  const sunIndicatorRef = useRef(null);

  const calculateSunPosition = (sunrise, sunset, currentTime) => {
    if (currentTime >= sunrise && currentTime <= sunset) {
      const totalDaylight = sunset - sunrise;
      const timeSinceSunrise = currentTime - sunrise;
      const percentage = timeSinceSunrise / totalDaylight;

      // Calculate angle (180 degrees to 0 degrees, moving clockwise)
      const angle = 180 - percentage * 180;
      const radian = (angle * Math.PI) / 180;

      // Calculate x and y positions along the semicircle
      const x = 50 + Math.cos(radian) * 50; // 50% is the center
      const y = 100 - Math.sin(radian) * 100; // Invert y to match CSS coordinates

      return { x, y, visible: true };
    }
    
    // Before sunrise or after sunset: return position but with visible: false
    if (currentTime < sunrise) {
      return { x: 0, y: 100, visible: false };
    }
    return { x: 100, y: 100, visible: false };
  };

  useEffect(() => {
    if (!weather || !sunIndicatorRef.current) return;

    // Convert sunrise and sunset to local time including timezone offset
    const updateSunPosition = () => {
      const sunrise =
        weather.sys.sunrise * 1000 +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;

      const sunset =
        weather.sys.sunset * 1000 +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;

      const localTime =
        Date.now() +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;

      const position = calculateSunPosition(sunrise, sunset, localTime);

      // First fade out
      sunIndicatorRef.current.style.opacity = "0";

      // Update position after fade out
      setTimeout(() => {
        sunIndicatorRef.current.style.left = `${position.x}%`;
        sunIndicatorRef.current.style.top = `${position.y}%`;

        // Only show the sun if it's visible (during daytime)
        if (position.visible) {
          setTimeout(() => {
            sunIndicatorRef.current.style.opacity = "1";
          }, 50);
        }
      }, 300);
    };

    updateSunPosition();
    const interval = setInterval(updateSunPosition, 30000);

    return () => clearInterval(interval);
  }, [weather]);

  return (
    <div className="sunrise-sunset-visual">
      <div className="sun-path">
        <div ref={sunIndicatorRef} className="sun-indicator" />
      </div>
      <div className="sunrise-sunset-info">
        <div className="sunrise-label">
          <p>Sunrise</p>
          <p>
            {new Date(
              weather.sys.sunrise * 1000 +
                new Date().getTimezoneOffset() * 60 * 1000 +
                weather.timezone * 1000
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: !is24HourFormat,
            })}
          </p>
        </div>
        <div className="sunset-label">
          <p>Sunset</p>
          <p>
            {new Date(
              weather.sys.sunset * 1000 +
                new Date().getTimezoneOffset() * 60 * 1000 +
                weather.timezone * 1000
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: !is24HourFormat,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
