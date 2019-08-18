import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 100;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
        this._position = new Animated.ValueXY();      
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this._position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                   this.forceSwipe('right');                 
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                   this.forceSwipe('left');                   
                } else {                  
                   this.resetPosition();
                }
            }
        });
    }  

    onSwipeComplete = (direction) => {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];
        // eslint-disable-next-line no-unused-expressions
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this._position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    getCardStyle = () => {
        const { _position } = this;
        const rotate = _position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return ({
            ..._position.getLayout(),
            transform: [{ rotate }]
        });
    }

    resetPosition = () => Animated.spring(this._position, {
            toValue: { x: 0, y: 0 }
        }).start() 

    forceSwipe = (direction) => {
        const x = direction === 'right' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2;
        return Animated.timing(this._position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    } 

    renderCard = () => {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        return this.props.data.map((item, i) => {
            if (i < this.state.index) { 
                console.log('sequence', i);
                return null; 
            }

            if (i === this.state.index) {
                console.log('sequence', i);
              return (
                <Animated.View
                key={item.id}
                style={[this.getCardStyle(), styles.cardStyle]}
                {...this._panResponder.panHandlers}
                >
                   { this.props.renderCard(item)}
                </Animated.View>  
                );
            }
            console.log('sequence', i);
            return (                
                <View key={item.id} style={styles.cardStyle}>
                   { this.props.renderCard(item)}
                </View>
            );
        }).reverse();
    }
    render() {
        return (
            <View>
                {this.renderCard()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
});

export default Deck;
