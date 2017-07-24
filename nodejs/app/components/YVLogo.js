import React, { PropTypes } from 'react'

function YVLogo({ fill, height, width }) {
	return (
		<svg width={width} height={height} viewBox="0 0 216 31" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g fill={fill}>
					<path d="M196.219263,8.21735714 L201.300546,8.21735714 L201.300546,11.6130792 C202.715972,9.55855852 204.756651,7.75631916 208.171126,7.75631916 C213.126717,7.75631916 216,11.1101286 216,16.225071 L216,30.3544341 L210.961148,30.3544341 L210.961148,17.7758351 C210.961148,14.3390065 209.25351,12.3675049 206.255337,12.3675049 C203.341225,12.3675049 201.300546,14.4220256 201.300546,17.8604662 L201.300546,30.3544341 L196.219263,30.3544341 L196.219263,8.21735714 Z M187.766256,19.4117945 L187.766256,19.3279694 C187.766256,15.4284908 184.976234,12.200419 181.019766,12.200419 C176.980038,12.200419 174.398166,15.3865783 174.398166,19.2441443 L174.398166,19.3279694 C174.398166,23.1855354 177.188189,26.4136072 181.103026,26.4136072 C185.183584,26.4136072 187.766256,23.2266419 187.766256,19.4117945 Z M169.359314,19.4117945 L169.359314,19.3279694 C169.359314,12.9967573 174.356536,7.75607736 181.103026,7.75607736 C187.849516,7.75607736 192.805108,12.9129322 192.805108,19.2441443 L192.805108,19.3279694 C192.805108,25.6164629 187.807886,30.8571429 181.019766,30.8571429 C174.314906,30.8571429 169.359314,25.701094 169.359314,19.4117945 Z M160.572866,8.21727654 L165.653348,8.21727654 L165.653348,30.3543535 L160.572866,30.3543535 L160.572866,8.21727654 Z M160.405544,0 L165.819869,0 L165.819869,4.8207485 L160.405544,4.8207485 L160.405544,0 Z M139.334672,27.4616626 L141.583502,24.0232221 C143.998853,25.8262674 146.539094,26.7483434 148.787924,26.7483434 C150.953493,26.7483434 152.203199,25.8262674 152.203199,24.3585224 L152.203199,24.2746973 C152.203199,22.556283 149.871109,21.9695074 147.288437,21.1723631 C144.040483,20.2502871 140.417056,18.9082797 140.417056,14.7162194 L140.417056,14.6315883 C140.417056,10.3976154 143.873161,7.83933824 148.245931,7.83933824 C150.995124,7.83933824 153.993297,8.80413274 156.325387,10.3548968 L154.326338,13.9609876 C152.203199,12.6616988 149.953569,11.8645544 148.121841,11.8645544 C146.164422,11.8645544 145.039607,12.8293489 145.039607,14.0448127 L145.039607,14.1286378 C145.039607,15.764033 147.413327,16.4346337 149.995999,17.2728845 C153.202323,18.2787856 156.824949,19.7473366 156.824949,23.7298343 L156.824949,23.8144654 C156.824949,28.4675637 153.243953,30.7735596 148.663033,30.7735596 C145.539169,30.7735596 142.083064,29.6838334 139.334672,27.4616626 Z M124.717837,8.21735714 L129.79832,8.21735714 L129.79832,13.2057558 C131.172916,9.89385887 133.713157,7.62977552 137.585564,7.79742569 L137.585564,13.1646493 L137.294153,13.1646493 C132.879753,13.1646493 129.79832,16.0574208 129.79832,21.9275949 L129.79832,30.3544341 L124.717837,30.3544341 L124.717837,8.21735714 Z M115.515407,17.7344061 C115.181565,14.4636157 113.266577,11.9069506 109.935363,11.9069506 C106.853129,11.9069506 104.68836,14.2959655 104.229627,17.7344061 L115.515407,17.7344061 Z M99.2324051,19.3689953 L99.2324051,19.2859762 C99.2324051,12.9547642 103.688435,7.75599676 109.976993,7.75599676 C116.972463,7.75599676 120.512629,13.2900645 120.512629,19.6631891 C120.512629,20.1242271 120.470999,20.5852651 120.429369,21.0882156 L104.271257,21.0882156 C104.81245,24.6943064 107.353491,26.7069145 110.601446,26.7069145 C113.058426,26.7069145 114.807694,25.7840325 116.556162,24.0648122 L119.513505,26.7069145 C117.431196,29.2224731 114.557113,30.8570623 110.518185,30.8570623 C104.146367,30.8570623 99.2324051,26.2039639 99.2324051,19.3689953 Z M95.6093791,1.00598164 L86.8646408,23.5629901 L78.0774717,1.00598164 L72.4133663,1.00598164 L84.4901197,30.5631908 L89.07104,30.5631908 L101.147793,1.00598164 L95.6093791,1.00598164 Z M50.1794108,22.3044854 L50.1794108,8.21703473 L55.218263,8.21703473 L55.218263,20.7948278 C55.218263,24.2332684 56.9259007,26.1612454 59.9240739,26.1612454 C62.8389866,26.1612454 64.8796657,24.1494433 64.8796657,20.7110027 L64.8796657,8.21703473 L69.9601482,8.21703473 L69.9601482,30.3541117 L64.8796657,30.3541117 L64.8796657,26.9164772 C63.4642398,29.0121043 61.4235607,30.8159557 58.0082853,30.8159557 C53.0526934,30.8159557 50.1794108,27.4613402 50.1794108,22.3044854 Z M41.5180929,19.4117945 L41.5180929,19.3279694 C41.5180929,15.4284908 38.7280707,12.200419 34.771603,12.200419 C30.7318749,12.200419 28.1500035,15.3865783 28.1500035,19.2441443 L28.1500035,19.3279694 C28.1500035,23.1855354 30.9408264,26.4136072 34.8548633,26.4136072 C38.9362216,26.4136072 41.5180929,23.2266419 41.5180929,19.4117945 Z M23.1111513,19.4117945 L23.1111513,19.3279694 C23.1111513,12.9967573 28.1083734,7.75607736 34.8548633,7.75607736 C41.6013533,7.75607736 46.5569452,12.9129322 46.5569452,19.2441443 L46.5569452,19.3279694 C46.5569452,25.6164629 41.5597231,30.8571429 34.771603,30.8571429 C28.0667432,30.8571429 23.1111513,25.701094 23.1111513,19.4117945 Z M11.5763907,18.7828645 L0,1.00549804 L6.07960659,1.00549804 L14.1998923,13.96131 L22.4458691,1.00549804 L28.3173248,1.00549804 L16.7401335,18.6571269 L16.7401335,30.3539505 L11.5763907,30.3539505 L11.5763907,18.7828645 Z" id="YouVersion-Logo-Copy-2" />
				</g>
			</g>
		</svg>
	)
}

YVLogo.propTypes = {
	fill: PropTypes.string,
	height: PropTypes.number,
	width: PropTypes.number
}

YVLogo.defaultProps = {
	fill: '#606061',
	height: 31,
	width: 216
}

export default YVLogo
