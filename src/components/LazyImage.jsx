import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';

const LazyImage = ({ source, style, resizeMode = 'cover', placeholderColor = '#e1e1e1' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {!error ? (
        <Image
          source={source}
          style={[StyleSheet.absoluteFill, style]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
          <Image 
            source={require('../../assets/image-not-found.png')} 
            style={styles.errorImage} 
            resizeMode="contain" 
          />
        </View>
      )}
      
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e1e1',
    overflow: 'hidden',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorImage: {
    width: '50%',
    height: '50%',
  }
});

export default LazyImage;