import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { getWeather, weatherMapping } from "../lib";
import moment from "moment";
import { Icon } from "@chakra-ui/react";
import { IoLocationSharp, IoArrowBack } from "react-icons/io5";
import {
  CurrentlyDataPoint,
  DailyDataBlock,
  HourlyDataBlock,
  HourlyDataPoint,
} from "../types/datapoint";
import debounce from "lodash/debounce";

interface CardProps {}
interface DarkSkyType {
  timezone: string;
  currently: CurrentlyDataPoint;
  daily: DailyDataBlock;
  hourly: HourlyDataBlock;
}

const Card: React.FC<CardProps> = () => {
  const [weather, setWeather] = useState<DarkSkyType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [locationEdit, setLocationEdit] = useState(false);
  const [coords, setCoords] = useState<
    | {
        lat: number;
        long: number;
      }
    | undefined
  >(undefined);
  const [coordsDraft, setCoordsDraft] = useState<
    | {
        lat: number;
        long: number;
      }
    | undefined
  >(undefined);
  const toggleEditMode = () => {
    setLocationEdit((prevState) => !prevState);
  };
  const delayedUpdate = useCallback(
    debounce(
      (_coords: { lat: number; long: number }) => setCoords(_coords),
      300
    ),
    []
  );
  const handleLatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoordsDraft((prevState) => {
      let oldState = Object.assign({}, prevState);
      oldState.lat = parseInt(event.target.value);
      return oldState;
    });
    if (coordsDraft) {
      delayedUpdate(coordsDraft);
    }
  };
  const handleLongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoordsDraft((prevState) => {
      let oldState = Object.assign({}, prevState);
      oldState.long = parseInt(event.target.value);
      return oldState;
    });
    if (coordsDraft) {
      delayedUpdate(coordsDraft);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
      setCoordsDraft({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const GetWeather = async () => {
      setLoading(true);

      try {
        if (coords) {
          const res = await getWeather(
            coords.lat.toString(),
            coords.long.toString()
          );
          setWeather(res);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    GetWeather();
  }, [coords]);

  if (loading) {
    return <Spinner />;
  }

  if (weather) {
    // Getting temp
    const getTemps = (data: HourlyDataPoint[]) =>
      data.map((p) => p.temperature);
    // Getting max Temp
    const getMaxTemps = (currentData: HourlyDataPoint[]) =>
      Math.round(Math.max(...getTemps(currentData)));

    // Getting min Temp
    const getMinTemps = (currentData: HourlyDataPoint[]) =>
      Math.round(Math.min(...getTemps(currentData)));

    return (
      <Box
        width="250px"
        position="relative"
        py={4}
        color="#FFFDFD"
        display="flex"
        flexDir="column"
      >
        {locationEdit ? (
          <VStack>
            <Button onClick={toggleEditMode}>
              <Icon as={IoArrowBack} mr={2} />
              <Text fontSize="sm">Go back</Text>
            </Button>
            <Box width="100%" py={2} px={4}>
              <Heading size="sm" py={1}>
                Latitude
              </Heading>
              <Input
                value={coordsDraft?.lat}
                type="number"
                size="sm"
                mb={2}
                onChange={handleLatChange}
              />
              <Heading size="sm" py={1}>
                Longitude
              </Heading>
              <Input
                value={coordsDraft?.long}
                type="number"
                size="sm"
                mb={2}
                onChange={handleLongChange}
              />
            </Box>
          </VStack>
        ) : (
          <VStack flexGrow={1} width="100%">
            <Button onClick={toggleEditMode}>
              <Icon as={IoLocationSharp} mr={2} />
              <Text fontSize="sm">{weather.timezone}</Text>
            </Button>

            <Center>
              <Text fontSize="sm">
                {moment
                  .unix(weather.currently.time)
                  .format("ddd, MMMM DD, HH:mm")}
              </Text>
            </Center>
            <Flex
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              width="100%"
              py={4}
            >
              <Heading
                size="3xl"
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                data-icon={weatherMapping(weather.currently.icon)}
              />
              <Heading
                size="3xl"
                display="flex"
                justifyContent="center"
                alignItems="center"
                as="div"
              >
                {`${Math.round(weather.currently.temperature)}`}
                <Heading size="md" px={1}>
                  <Flex
                    data-icon="9"
                    justifyContent="space-around"
                    alignItems="center"
                  />
                </Heading>
              </Heading>
            </Flex>

            <Text fontSize="sm">{`Feels Like: ${Math.round(
              weather.currently.apparentTemperature
            )}˚ Low: ${getMinTemps(weather.hourly.data)}˚ High: ${getMaxTemps(
              weather.hourly.data
            )}˚`}</Text>

            <Center>
              <Text fontSize="lg">{weather.currently.summary}</Text>
            </Center>
            <Accordion width="100%" allowToggle pb={4}>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Hourly
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {weather.hourly.data
                    .filter((_ite, _index) => _index % 3 === 1)
                    .map((item, index) => (
                      <Flex alignItems="center" key={index}>
                        <Heading
                          size="xl"
                          data-icon={weatherMapping(item.icon)}
                        />
                        <Text size="sm" pl={2}>
                          {moment.unix(item.time).format("HH:mm")}
                        </Text>
                        <Badge size="sm" mx={2}>
                          {Math.round(item.temperature)}˚
                        </Badge>

                        <Text size="sm" pl={2}>
                          {item.summary}
                        </Text>
                      </Flex>
                    ))}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Weekly
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={2}>
                  {weather.daily.data.map((item, index) => (
                    <Flex
                      alignItems="center"
                      key={index}
                      _notLast={{
                        borderBottom: "1px solid",
                      }}
                      py={2}
                      flexDir="column"
                      flexWrap="wrap"
                    >
                      <Flex alignItems="center" width="100%" pb={2}>
                        <Heading
                          size="3xl"
                          data-icon={weatherMapping(item.icon)}
                        />
                        <Text size="sm" pl={2}>
                          {moment.unix(item.time).format("ddd, MMMM DD")}
                        </Text>
                      </Flex>
                      <Flex
                        alignItems="center"
                        justifyContent="space-around"
                        width="100%"
                        pb={1}
                      >
                        <Box>
                          {moment
                            .unix(item.temperatureMinTime)
                            .format("h:mm a")}
                          <Badge mx={1}>
                            {Math.round(item.temperatureMin)}˚
                          </Badge>
                        </Box>
                        <Box>
                          {moment
                            .unix(item.temperatureMaxTime)
                            .format("h:mm a")}
                          <Badge mx={1}>
                            {Math.round(item.temperatureMax)}˚
                          </Badge>
                        </Box>
                      </Flex>
                      <Text size="sm" width="100%">
                        {item.summary}
                      </Text>
                    </Flex>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        )}

        <VStack>
          <Flex justifyContent="center" alignItems="center">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://darksky.net/poweredby/"
              isExternal
            >
              Powered by Dark Sky <ExternalLinkIcon mx="2px" />
            </Link>
          </Flex>
        </VStack>
      </Box>
    );
  } else {
    return null;
  }
};
export default Card;
