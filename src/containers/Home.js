import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Página de Inscrições</h1>
                    <h3><p>16ª Edição: início a 22 de Setembro de 2023</p></h3>
                    <h4><p style={{ color: 'red' }}>Prazo limite de inscrições: 10 de Setembro de 2023</p></h4>
                </div>     
<p>Para participar no torneio, as coletividades interessadas terão de inscrever os escalões e respectivos jogadores e equipa técnica 
neste site.<br />
A partir da 13ª edição (2018) as inscrições devem ser feitas exclusivamente através deste site. 
Mantêm-se os requisitos das edições anteriores: é necessário uma <strong>fotografia</strong> e a <strong>folha de inscrição</strong>
&nbsp;(disponível na área de <Link to="/documents">documentos</Link>) com os dados do jogador e assinatura (para jogadores menores 
de 18 anos a assinatura do encarregado de educação).
A fotografia pode ser tirada com um telemóvel (deve ser idêntica a uma fotografia tipo passe) e a folha de inscrição deve ser preenchida 
e posteriormente digitalizada, sendo ambos carregados na página de inscrição de jogador. Para a equipa técnica apenas é necessária a fotografia.</p>

<p>Os escalões disponíveis para inscrição são os seguintes:</p>
<ul>
    <li><strong>Escolinhas</strong> - masculino e feminino, para nascidos entre 19/11/2014 e 31/12/2018 (Dos 5 aos 8 anos);</li>
    <li><strong>I Escalão</strong> - masculino e feminino, para nascidos entre 19/11/2010 e 18/11/2014 (Dos 8 aos 12 anos);</li>
    <li><strong>II Escalão</strong> - masculino para nascidos entre 19-11-2005 a 18-11-2010 (Dos 13 aos 17 anos);</li>
    <li><strong>III Escalão</strong> - masculino para nascidos antes de 19-11-2005 (+ de 17 anos);</li>
    <li><strong>Escalão Feminino</strong> - para nascidas antes de 19-11-2010 (+ de 12 anos).</li>
</ul>

<p>Para mais informações sobre o torneio consulte o 
    <a href="https://drive.google.com/file/d/11Shg03w-2W7DxK663heO7nryndqr6Jy6/view?usp=sharing" target="_blank" rel="noopener noreferrer"> Regulamento Desportivo</a>.</p>
<p>Qualquer problema ou questão relacionada com a página de inscrições, envie um mail para <a href="mailto:courela+tacabarnabe@gmail.com">courela+tacabarnabe@gmail.com</a>.</p>

<p>Acompanhe-nos no Facebook e no Twitter.</p>
                <h2>Links</h2>
                <ul>
                    <li><a href="https://www.facebook.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://twitter.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                </ul>
            </div>
        );
    }
}
