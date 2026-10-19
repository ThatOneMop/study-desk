import{Clock as rt,HalfFloatType as ot,NoBlending as nt,Vector2 as Le,WebGLRenderTarget as lt}from"./three.module.min.js";var z={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};import{ShaderMaterial as je,UniformsUtils as at}from"./three.module.min.js";import{BufferGeometry as $e,Float32BufferAttribute as Ie,OrthographicCamera as et,Mesh as tt}from"./three.module.min.js";var D=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},it=new et(-1,1,1,-1,0,1),Oe=class extends $e{constructor(){super(),this.setAttribute("position",new Ie([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ie([0,2,0,0,2,0],2))}},st=new Oe,k=class{constructor(e){this._mesh=new tt(st,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,it)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var V=class extends D{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof je?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=at.clone(e.uniforms),this.material=new je({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new k(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var se=class extends D{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){let a=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),i.buffers.stencil.setFunc(a.ALWAYS,r,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(a.EQUAL,1,4294967295),i.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),i.buffers.stencil.setLocked(!0)}},pe=class extends D{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var me=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let s=e.getSize(new Le);this._width=s.width,this._height=s.height,t=new lt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ot}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new V(z),this.copyPass.material.blending=nt,this.clock=new rt}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),s=!1;for(let a=0,i=this.passes.length;a<i;a++){let r=this.passes[a];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),r.needsSwap){if(s){let o=this.renderer.getContext(),T=this.renderer.state.buffers.stencil;T.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),T.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}se!==void 0&&(r instanceof se?s=!0:r instanceof pe&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Le);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let s=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(s,a),this.renderTarget2.setSize(s,a);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(s,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};import{AddEquation as Ze,Color as ht,CustomBlending as ct,DataTexture as ft,DepthTexture as ut,DstAlphaFactor as pt,DstColorFactor as mt,FloatType as dt,HalfFloatType as Be,MathUtils as gt,MeshNormalMaterial as vt,NearestFilter as Ge,NoBlending as Z,RedFormat as _t,DepthStencilFormat as xt,UnsignedInt248Type as Mt,RepeatWrapping as Qe,ShaderMaterial as ge,UniformsUtils as ve,Vector3 as St,WebGLRenderTarget as Ke,ZeroFactor as qe}from"./three.module.min.js";var de=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let s,a,i,r=.5*(Math.sqrt(3)-1),o=(e+t)*r,T=Math.floor(e+o),n=Math.floor(t+o),P=(3-Math.sqrt(3))/6,b=(T+n)*P,A=T-b,g=n-b,_=e-A,C=t-g,E,N;_>C?(E=1,N=0):(E=0,N=1);let p=_-E+P,m=C-N+P,u=_-1+2*P,x=C-1+2*P,M=T&255,S=n&255,w=this.perm[M+this.perm[S]]%12,l=this.perm[M+E+this.perm[S+N]]%12,h=this.perm[M+1+this.perm[S+1]]%12,c=.5-_*_-C*C;c<0?s=0:(c*=c,s=c*c*this._dot(this.grad3[w],_,C));let f=.5-p*p-m*m;f<0?a=0:(f*=f,a=f*f*this._dot(this.grad3[l],p,m));let R=.5-u*u-x*x;return R<0?i=0:(R*=R,i=R*R*this._dot(this.grad3[h],u,x)),70*(s+a+i)}noise3d(e,t,s){let a,i,r,o,n=(e+t+s)*.3333333333333333,P=Math.floor(e+n),b=Math.floor(t+n),A=Math.floor(s+n),g=1/6,_=(P+b+A)*g,C=P-_,E=b-_,N=A-_,p=e-C,m=t-E,u=s-N,x,M,S,w,l,h;p>=m?m>=u?(x=1,M=0,S=0,w=1,l=1,h=0):p>=u?(x=1,M=0,S=0,w=1,l=0,h=1):(x=0,M=0,S=1,w=1,l=0,h=1):m<u?(x=0,M=0,S=1,w=0,l=1,h=1):p<u?(x=0,M=1,S=0,w=0,l=1,h=1):(x=0,M=1,S=0,w=1,l=1,h=0);let c=p-x+g,f=m-M+g,R=u-S+g,B=p-w+2*g,G=m-l+2*g,Q=u-h+2*g,K=p-1+3*g,q=m-1+3*g,v=u-1+3*g,I=P&255,j=b&255,L=A&255,he=this.perm[I+this.perm[j+this.perm[L]]]%12,ce=this.perm[I+x+this.perm[j+M+this.perm[L+S]]]%12,fe=this.perm[I+w+this.perm[j+l+this.perm[L+h]]]%12,ue=this.perm[I+1+this.perm[j+1+this.perm[L+1]]]%12,y=.6-p*p-m*m-u*u;y<0?a=0:(y*=y,a=y*y*this._dot3(this.grad3[he],p,m,u));let F=.6-c*c-f*f-R*R;F<0?i=0:(F*=F,i=F*F*this._dot3(this.grad3[ce],c,f,R));let U=.6-B*B-G*G-Q*Q;U<0?r=0:(U*=U,r=U*U*this._dot3(this.grad3[fe],B,G,Q));let O=.6-K*K-q*q-v*v;return O<0?o=0:(O*=O,o=O*O*this._dot3(this.grad3[ue],K,q,v)),32*(a+i+r+o)}noise4d(e,t,s,a){let i=this.grad4,r=this.simplex,o=this.perm,T=(Math.sqrt(5)-1)/4,n=(5-Math.sqrt(5))/20,P,b,A,g,_,C=(e+t+s+a)*T,E=Math.floor(e+C),N=Math.floor(t+C),p=Math.floor(s+C),m=Math.floor(a+C),u=(E+N+p+m)*n,x=E-u,M=N-u,S=p-u,w=m-u,l=e-x,h=t-M,c=s-S,f=a-w,R=l>h?32:0,B=l>c?16:0,G=h>c?8:0,Q=l>f?4:0,K=h>f?2:0,q=c>f?1:0,v=R+B+G+Q+K+q,I=r[v][0]>=3?1:0,j=r[v][1]>=3?1:0,L=r[v][2]>=3?1:0,he=r[v][3]>=3?1:0,ce=r[v][0]>=2?1:0,fe=r[v][1]>=2?1:0,ue=r[v][2]>=2?1:0,y=r[v][3]>=2?1:0,F=r[v][0]>=1?1:0,U=r[v][1]>=1?1:0,O=r[v][2]>=1?1:0,ke=r[v][3]>=1?1:0,xe=l-I+n,Me=h-j+n,Se=c-L+n,Te=f-he+n,Pe=l-ce+2*n,Ce=h-fe+2*n,we=c-ue+2*n,Re=f-y+2*n,De=l-F+3*n,be=h-U+3*n,Ee=c-O+3*n,Ne=f-ke+3*n,Ae=l-1+4*n,ye=h-1+4*n,Fe=c-1+4*n,Ue=f-1+4*n,W=E&255,H=N&255,X=p&255,Y=m&255,We=o[W+o[H+o[X+o[Y]]]]%32,He=o[W+I+o[H+j+o[X+L+o[Y+he]]]]%32,Xe=o[W+ce+o[H+fe+o[X+ue+o[Y+y]]]]%32,Ye=o[W+F+o[H+U+o[X+O+o[Y+ke]]]]%32,Je=o[W+1+o[H+1+o[X+1+o[Y+1]]]]%32,J=.6-l*l-h*h-c*c-f*f;J<0?P=0:(J*=J,P=J*J*this._dot4(i[We],l,h,c,f));let $=.6-xe*xe-Me*Me-Se*Se-Te*Te;$<0?b=0:($*=$,b=$*$*this._dot4(i[He],xe,Me,Se,Te));let ee=.6-Pe*Pe-Ce*Ce-we*we-Re*Re;ee<0?A=0:(ee*=ee,A=ee*ee*this._dot4(i[Xe],Pe,Ce,we,Re));let te=.6-De*De-be*be-Ee*Ee-Ne*Ne;te<0?g=0:(te*=te,g=te*te*this._dot4(i[Ye],De,be,Ee,Ne));let ie=.6-Ae*Ae-ye*ye-Fe*Fe-Ue*Ue;return ie<0?_=0:(ie*=ie,_=ie*ie*this._dot4(i[Je],Ae,ye,Fe,Ue)),27*(P+b+A+g+_)}_dot(e,t,s){return e[0]*t+e[1]*s}_dot3(e,t,s,a){return e[0]*t+e[1]*s+e[2]*a}_dot4(e,t,s,a,i){return e[0]*t+e[1]*s+e[2]*a+e[3]*i}};import{Matrix4 as ze,Vector2 as Ve}from"./three.module.min.js";var ae={name:"SSAOShader",defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new Ve},cameraProjectionMatrix:{value:new ze},cameraInverseProjectionMatrix:{value:new ze},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},re={name:"SSAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},oe={name:"SSAOBlurShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Ve}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};var ne=class d extends D{constructor(e,t,s=512,a=512,i=32){super(),this.width=s,this.height=a,this.clear=!0,this.needsSwap=!1,this.camera=t,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(i),this._generateRandomKernelRotations();let r=new ut;r.format=xt,r.type=Mt,this.normalRenderTarget=new Ke(this.width,this.height,{minFilter:Ge,magFilter:Ge,type:Be,depthTexture:r}),this.ssaoRenderTarget=new Ke(this.width,this.height,{type:Be}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new ge({defines:Object.assign({},ae.defines),uniforms:ve.clone(ae.uniforms),vertexShader:ae.vertexShader,fragmentShader:ae.fragmentShader,blending:Z}),this.ssaoMaterial.defines.KERNEL_SIZE=i,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new vt,this.normalMaterial.blending=Z,this.blurMaterial=new ge({defines:Object.assign({},oe.defines),uniforms:ve.clone(oe.uniforms),vertexShader:oe.vertexShader,fragmentShader:oe.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new ge({defines:Object.assign({},re.defines),uniforms:ve.clone(re.uniforms),vertexShader:re.vertexShader,fragmentShader:re.fragmentShader,blending:Z}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new ge({uniforms:ve.clone(z.uniforms),vertexShader:z.vertexShader,fragmentShader:z.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:mt,blendDst:qe,blendEquation:Ze,blendSrcAlpha:pt,blendDstAlpha:qe,blendEquationAlpha:Ze}),this._fsQuad=new k(null),this._originalClearColor=new ht}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(e,t,s){switch(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case d.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=Z,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:s);break;case d.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Z,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:s);break;case d.OUTPUT.Depth:this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:s);break;case d.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Z,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:s);break;case d.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=ct,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:s);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(e,t){this.width=e,this.height=t,this.ssaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.blurRenderTarget.setSize(e,t),this.ssaoMaterial.uniforms.resolution.value.set(e,t),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,t)}_renderPass(e,t,s,a,i){e.getClearColor(this._originalClearColor);let r=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,a!=null&&(e.setClearColor(a),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(r)}_renderOverride(e,t,s,a,i){e.getClearColor(this._originalClearColor);let r=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,a=t.clearColor||a,i=t.clearAlpha||i,a!=null&&(e.setClearColor(a),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(r)}_generateSampleKernel(e){let t=this.kernel;for(let s=0;s<e;s++){let a=new St;a.x=Math.random()*2-1,a.y=Math.random()*2-1,a.z=Math.random(),a.normalize();let i=s/e;i=gt.lerp(.1,1,i*i),a.multiplyScalar(i),t.push(a)}}_generateRandomKernelRotations(){let s=new de,a=16,i=new Float32Array(a);for(let r=0;r<a;r++){let o=Math.random()*2-1,T=Math.random()*2-1,n=0;i[r]=s.noise3d(o,T,n)}this.noiseTexture=new ft(i,4,4,_t,dt),this.noiseTexture.wrapS=Qe,this.noiseTexture.wrapT=Qe,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(s){(s.isPoints||s.isLine||s.isLine2)&&s.visible&&(s.visible=!1,t.push(s))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}};ne.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};import{ColorManagement as Tt,RawShaderMaterial as Pt,UniformsUtils as Ct,LinearToneMapping as wt,ReinhardToneMapping as Rt,CineonToneMapping as Dt,AgXToneMapping as bt,ACESFilmicToneMapping as Et,NeutralToneMapping as Nt,CustomToneMapping as At,SRGBTransfer as yt}from"./three.module.min.js";var le={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var _e=class extends D{constructor(){super(),this.uniforms=Ct.clone(le.uniforms),this.material=new Pt({name:le.name,uniforms:this.uniforms,vertexShader:le.vertexShader,fragmentShader:le.fragmentShader}),this._fsQuad=new k(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Tt.getTransfer(this._outputColorSpace)===yt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===wt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Rt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Dt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Et?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===bt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Nt?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===At&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function ci(d,e,t,s,a){let i=new me(d);i.setPixelRatio(1);let r=new ne(e,t,s,a,12);r.kernelRadius=.65,r.minDistance=.001,r.maxDistance=.08,i.addPass(r),i.addPass(new _e);let o=new V({uniforms:{tDiffuse:{value:null}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,1.04);c=(c-.5)*1.04+.5;vec2 q=vUv-.5;c*=1.-.12*dot(q,q);gl_FragColor=vec4(c,1.);}"});return i.addPass(o),i.setSize(s,a),{render:()=>i.render(),resize:(T,n)=>i.setSize(T,n),dispose:()=>i.dispose()}}export{ci as createEffects};
