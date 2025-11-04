import PropTypes from 'prop-types';

/**
 * @typedef {Object} TextProps
 * @property {ChildNode | string} children
 * @property {'xs' | 'sm' | 'md' | 'lg' | 'xl'} fontSize
 * @property {'light' | 'normal' | 'medium' | 'semibold' | 'bold'} fontWeight
 * @property {string} color
 *
 * @param {TextProps}
 * @returns
 */
export const Text = ({
  children,
  fontSize = 'md',
  fontWeight = 'normal',
  color = 'var(--primary-fg)',
  styles = {},
}) => {
  return (
    <span
      style={{
        fontSize: `var(--font-${fontSize})`,
        fontWeight: `var(--font-${fontWeight})`,
        color,
        ...styles,
      }}
    >
      {children}
    </span>
  );
};

Text.propTypes = {
  children: PropTypes.string,
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  fontWeight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold',
  color: PropTypes.string,
};