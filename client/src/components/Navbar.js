import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiMenu, FiX, FiHome, FiBook, FiPlus, FiUser, FiLogOut, FiBarChart2, FiGlobe, FiChevronDown, FiDroplet } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { useColors } from '../context/ColorContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid ${props => props.theme.primary}20;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-right: 40px;
  
  &:hover {
    color: ${props => props.theme.secondary};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  text-align: center;

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
    transform: translateY(-1px);
  }

  &.active {
    background: ${props => props.theme.gradient};
    color: white;
    box-shadow: 0 4px 12px ${props => props.theme.primary}40;
  }

  &:focus {
    outline: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Button = styled(Link)`
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &.primary {
    background: ${props => props.theme.gradient};
    color: white;
    box-shadow: 0 4px 12px ${props => props.theme.primary}30;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${props => props.theme.primary}40;
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.primary};
    border: 2px solid ${props => props.theme.primary};

    &:hover {
      background: ${props => props.theme.primary};
      color: white;
      transform: translateY(-2px);
    }
  }

  &:focus {
    outline: none;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: ${props => props.theme.danger};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.danger}30;
  }

  &:focus {
    outline: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 1200px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid ${props => props.theme.primary}20;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 1201px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  text-align: center;

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &.active {
    background: ${props => props.theme.gradient};
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${props => props.theme.primary};
  font-size: 14px;
`;

const LanguageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid ${props => props.theme.primary}20;
  z-index: 1001;
`;

const LanguageButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
  }
`;

const LanguageMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 1001;
  border: 1px solid ${props => props.theme.primary}20;
`;

const LanguageOption = styled.button`
  display: block;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.theme.text};

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
  }
`;

const ColorSelector = styled.div`
  position: relative;
`;

const ColorButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
  }
`;

const ColorDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid ${props => props.theme.primary}20;
  z-index: 10;
  width: 180px;
`;

const ColorOption = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.theme.text};

  &:hover {
    background: ${props => props.theme.primary}15;
    color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
  }
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const DropdownsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, availableLanguages, isLoading } = useTranslation();
  const { colors, currentPalette, changePalette, getAllPalettes } = useColors();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const location = useLocation();
  const languageMenuRef = useRef();
  const colorMenuRef = useRef();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    setIsLanguageMenuOpen(false);
  };

  const handleColorChange = (paletteName) => {
    changePalette(paletteName);
    setIsColorMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setIsColorMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
  const allPalettes = getAllPalettes();

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      colors={colors}
    >
      <NavContent>
        <Logo to="/" colors={colors}>
          <FiBook />
          QuizMaster
        </Logo>

        <NavLinks>
          <NavLink to="/" className={isActive('/') ? 'active' : ''} colors={colors} gradient={colors.gradient}>
            <FiHome />
            {t('Strona główna')}
          </NavLink>
          <NavLink to="/quizzes" className={isActive('/quizzes') ? 'active' : ''} colors={colors} gradient={colors.gradient}>
            <FiBook />
            {t('Przeglądaj quizy')}
          </NavLink>
          {user && (
            <>
              <NavLink to="/create-quiz" className={isActive('/create-quiz') ? 'active' : ''} colors={colors} gradient={colors.gradient}>
                <FiPlus />
                {t('Utwórz quiz')}
              </NavLink>
              <NavLink to="/my-quizzes" className={isActive('/my-quizzes') ? 'active' : ''} colors={colors} gradient={colors.gradient}>
                <FiUser />
                {t('Moje Quizy')}
              </NavLink>
              <NavLink to="/results" className={isActive('/results') ? 'active' : ''} colors={colors} gradient={colors.gradient}>
                <FiBarChart2 />
                {t('Wyniki')}
              </NavLink>
            </>
          )}
        </NavLinks>

        <RightSection>
          <DropdownsWrapper>
            <ColorSelector ref={colorMenuRef}>
              <ColorButton
                onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                colors={colors}
              >
                <FiDroplet />
                {t('Wybierz kolor')}
              </ColorButton>

              <AnimatePresence>
                {isColorMenuOpen && (
                  <ColorDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Object.entries(allPalettes).map(([key, palette]) => (
                      <ColorOption
                        key={key}
                        onClick={() => handleColorChange(key)}
                        colors={colors}
                      >
                        <ColorPreview color={palette.gradient} />
                        {t(palette.name)}
                      </ColorOption>
                    ))}
                  </ColorDropdown>
                )}
              </AnimatePresence>
            </ColorSelector>
          </DropdownsWrapper>

          <LanguageWrapper>
            <LanguageButton
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              disabled={isLoading}
              colors={colors}
            >
              <FiGlobe />
              {currentLang?.flag} {currentLang?.name}
              <FiChevronDown style={{ transform: isLanguageMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </LanguageButton>

            {isLanguageMenuOpen && (
              <LanguageDropdown>
                {availableLanguages.map((language) => (
                  <LanguageOption
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={currentLanguage === language.code ? 'active' : ''}
                    colors={colors}
                  >
                    <span>{language.flag}</span>
                    {language.name}
                  </LanguageOption>
                ))}
              </LanguageDropdown>
            )}
          </LanguageWrapper>

          {user ? (
            <AuthButtons>
              <UserInfo colors={colors}>
                <FiUser />
                {user.username}
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                <FiLogOut />
                {t('Wyloguj')}
              </LogoutButton>
            </AuthButtons>
          ) : (
            <AuthButtons>
              <Button to="/login" className="secondary">
                {t('Zaloguj')}
              </Button>
              <Button to="/register" className="primary">
                {t('Zarejestruj')}
              </Button>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </RightSection>
      </NavContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            colors={colors}
          >
            <MobileNavLink to="/" className={isActive('/') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
              <FiHome />
              {t('Strona główna')}
            </MobileNavLink>
            <MobileNavLink to="/quizzes" className={isActive('/quizzes') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
              <FiBook />
              {t('Przeglądaj quizy')}
            </MobileNavLink>
            {user && (
              <>
                <MobileNavLink to="/create-quiz" className={isActive('/create-quiz') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
                  <FiPlus />
                  {t('Utwórz quiz')}
                </MobileNavLink>
                <MobileNavLink to="/my-quizzes" className={isActive('/my-quizzes') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
                  <FiUser />
                  {t('Moje Quizy')}
                </MobileNavLink>
                <MobileNavLink to="/results" className={isActive('/results') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
                  <FiBarChart2 />
                  {t('Wyniki')}
                </MobileNavLink>
                <MobileNavLink as="button" onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%' }}>
                  <FiLogOut />
                  {t('Wyloguj')}
                </MobileNavLink>
              </>
            )}
            {!user && (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
                  <FiUser />
                  {t('Zaloguj')}
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setIsMobileMenuOpen(false)} colors={colors} gradient={colors.gradient}>
                  <FiPlus />
                  {t('Zarejestruj')}
                </MobileNavLink>
              </>
            )}

            {/* Przyciski wyboru koloru i języka na dole menu mobilnego */}
            <div style={{ marginTop: 24, borderTop: `1px solid ${colors.primary}20`, paddingTop: 16 }}>
              <div style={{ marginBottom: 12, fontWeight: 600, color: colors.primary }}>{t('Wybierz kolor')}:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {Object.entries(allPalettes).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => { handleColorChange(key); setIsMobileMenuOpen(false); }}
                    style={{
                      background: palette.gradient,
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: key === currentPalette ? `0 0 0 2px ${colors.primary}` : 'none',
                      outline: 'none',
                      fontSize: 14
                    }}
                  >
                    {t(palette.name)}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 8, fontWeight: 600, color: colors.primary }}>{t('Język')}:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {availableLanguages.map(language => (
                  <button
                    key={language.code}
                    onClick={() => { handleLanguageChange(language.code); setIsMobileMenuOpen(false); }}
                    style={{
                      background: currentLanguage === language.code ? colors.primary : colors.background,
                      color: currentLanguage === language.code ? 'white' : colors.text,
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: currentLanguage === language.code ? `0 0 0 2px ${colors.primary}` : 'none',
                      outline: 'none',
                      fontSize: 14
                    }}
                  >
                    <span style={{ marginRight: 6 }}>{language.flag}</span>{language.name}
                  </button>
                ))}
              </div>
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navbar; 